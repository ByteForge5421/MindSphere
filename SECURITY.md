# Security Policy — MindSphere

## Incident: Hardcoded API Key in CI Workflow

**Date discovered:** 2026-03-09
**Severity:** High
**Status:** Remediated (pending key rotation)

### Summary

A Google Gemini API key (`AIza****fpA0`) was hardcoded in `.github/workflows/playwright.yml` (line 82) and committed in plaintext. The key was introduced in commit `70c2235`. The key must be treated as **compromised**.

### Immediate Response Checklist

- [ ] **Revoke / rotate the exposed key** in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  - Navigate to APIs & Services → Credentials
  - Find the key starting with `AIza****fpA0`
  - Delete or regenerate it
- [ ] **Create a GitHub Actions secret** named `GEMINI_API_KEY` with the new key value
  - Repository → Settings → Secrets and variables → Actions → New repository secret
- [ ] **Update Render environment variable** `GEMINI_API_KEY` with the rotated key (if applicable)
- [ ] **Update Netlify environment variable** `GEMINI_API_KEY` with the rotated key (if applicable)
- [ ] **Verify CI passes** after secret rotation by triggering a test run

### Verification Checklist

- [ ] `grep -rn 'AIza' .github/` returns **zero results**
- [ ] All workflow files reference `${{ secrets.GEMINI_API_KEY }}` instead of plaintext values
- [ ] CI secret-scan step passes (added to both `playwright.yml` and `deploy.yml`)
- [ ] Playwright tests pass with the secret reference
- [ ] No other API keys, tokens, or passwords are hardcoded in tracked files

### Git History Cleanup (Optional)

The key exists in git history in commit `70c2235`. Two options:

1. **Rotate-only (minimum, recommended for private repos):**
   Revoke the old key and issue a new one. The old key in history becomes inert.

2. **History rewrite (recommended if repo is or was public):**
   ```bash
   # Using git-filter-repo (preferred):
   pip install git-filter-repo
   git filter-repo --replace-text <(echo 'YOUR_EXPOSED_KEY==>REDACTED_KEY')

   # Or using BFG Repo-Cleaner:
   echo 'YOUR_EXPOSED_KEY' > secrets.txt
   bfg --replace-text secrets.txt
   git reflog expire --expire=now --all && git gc --prune=now --aggressive
   git push --force
   ```
   **Warning:** Force-pushing rewrites history for all collaborators.

## Prevention Controls

### 1. CI Secret Scanning (Active)

Both CI workflows now include a "Scan for leaked secrets" step that runs `grep` against common secret patterns (`AIza...`, `sk-...`, `ghp_...`, `AKIA...`) and **fails the build** if any are found.

### 2. Pre-commit Hook (Recommended)

Add a local pre-commit hook to catch secrets before they reach the repo:

```bash
# .git/hooks/pre-commit (make executable: chmod +x)
#!/bin/sh
if git diff --cached --diff-filter=ACMR -z | xargs -0 grep -Pn 'AIza[A-Za-z0-9_-]{30,}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{36}|AKIA[A-Z0-9]{16}' 2>/dev/null; then
  echo "ERROR: Potential secret detected in staged files. Commit blocked."
  exit 1
fi
```

### 3. GitHub Secret Scanning (Recommended)

Enable GitHub's built-in secret scanning:
- Repository → Settings → Code security and analysis
- Enable "Secret scanning" and "Push protection"

### 4. Best Practices

- **Never hardcode secrets** in source files, CI configs, or documentation
- Use `${{ secrets.SECRET_NAME }}` in GitHub Actions workflows
- Use environment variables via `.env` files (which are `.gitignore`d) for local development
- Review diffs before committing for accidental secret inclusion

## Reporting Security Issues

If you discover a security vulnerability in this project, please report it privately to the maintainers. Do not open a public issue.
