# Julian Morris Cursor Candidate Dealroom

A private, password-protected single-page candidate dealroom for Julian Morris's Cursor interview process.

## Run locally

Install dependencies:

```bash
npm install
```

Start the local site:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Edit content

All editable dealroom content lives in:

```text
content/dealroom.ts
```

Update that file to change section copy, timeline entries, performance metrics, case studies, reference cards, build items, and personal notes.

## Update the hiring process tracker

In `content/dealroom.ts`, edit the `process` array. Each stage supports:

```ts
{
  label: "Hiring Manager Interview",
  status: "active",
  date: "Add date",
  notes: "Current focus."
}
```

Use one of these status values:

```text
complete
active
upcoming
```

## Change the password

The current password is `cursor`.

To change it, open `content/dealroom.ts` and update:

```ts
password: "cursor"
```

This is light privacy only. The password is included in the client-side app bundle and is not enterprise-grade security.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. Import the repository in Vercel.
3. Keep the default Next.js settings.
4. Deploy.

No database or server-side configuration is required.
