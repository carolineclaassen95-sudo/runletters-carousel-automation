#!/usr/bin/env python3
"""Create a draft in the caroline@runletters.com mailbox via IMAP APPEND.

Never sends. Appends a MIME message with the \\Draft flag to the account's
Drafts folder so it shows up exactly like a hand-typed draft in webmail.

Credentials are read from brand-outreach/mail-creds.env (same directory),
NOT from the process environment — the cloud routine has no access to
Caroline's local .env.

Usage:
  python3 brand-outreach/mail-draft.py --to "brand@example.com" --subject "Subject" --body "Plain text body"
  python3 brand-outreach/mail-draft.py --to "a@x.com" --subject "S" --body-file body.txt
"""
import argparse
import email.utils
import imaplib
import os
import sys
import time
from email.message import EmailMessage
from pathlib import Path


def load_creds():
    creds_path = Path(__file__).resolve().parent / "mail-creds.env"
    env = {}
    for line in creds_path.read_text().splitlines():
        line = line.split("#", 1)[0].strip()
        if not line or "=" not in line:
            continue
        key, _, value = line.partition("=")
        env[key.strip()] = value.strip()
    return env


def find_drafts_folder(imap):
    status, folders = imap.list()
    if status != "OK":
        return "Drafts"
    for raw in folders:
        text = raw.decode(errors="ignore")
        if "\\Drafts" in text:
            return text.split('"')[-2] if text.count('"') >= 3 else text.rsplit(" ", 1)[-1].strip('"')
    return "Drafts"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--to", required=True)
    parser.add_argument("--subject", required=True)
    parser.add_argument("--body")
    parser.add_argument("--body-file")
    args = parser.parse_args()

    if not args.body and not args.body_file:
        sys.exit("Provide --body or --body-file")
    body = args.body if args.body else Path(args.body_file).read_text()

    env = load_creds()
    host = env["IMAP_HOST"]
    port = int(env.get("IMAP_PORT", "993"))
    user = env["IMAP_USER"]
    password = env["IMAP_PASSWORD"]

    msg = EmailMessage()
    msg["From"] = user
    msg["To"] = args.to
    msg["Subject"] = args.subject
    msg["Date"] = email.utils.formatdate(localtime=True)
    msg["Message-ID"] = email.utils.make_msgid()
    msg.set_content(body)

    imap = imaplib.IMAP4_SSL(host, port)
    try:
        imap.login(user, password)
        folder = find_drafts_folder(imap)
        status, response = imap.append(
            folder, "\\Draft", imaplib.Time2Internaldate(time.time()), msg.as_bytes()
        )
        if status != "OK":
            sys.exit(f"APPEND failed: {response}")
        print(f"Draft created in {folder!r} for {args.to}")
    finally:
        imap.logout()


if __name__ == "__main__":
    main()
