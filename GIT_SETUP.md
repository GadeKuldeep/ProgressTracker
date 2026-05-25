# Git Setup - Fix SSH Permission Issue

## Current Issue
Git SSH connection is failing with "Permission denied (publickey)". This is because SSH keys aren't configured or GitHub SSH access isn't set up.

## Solution: Use HTTPS Instead

Since you're getting SSH permission errors, switch to HTTPS for your GitHub remote:

### Step 1: Update Remote URL to HTTPS

Run this command in the ProgressTracker directory:

```powershell
git remote remove origin
git remote add origin https://github.com/GadeKuldeep/ProgressTracker.git
```

### Step 2: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

GitHub will prompt you for authentication. Use your GitHub credentials or a Personal Access Token.

### Step 3: First Push (Existing Commits)

If you have existing commits, force push them:

```powershell
git push -u origin main --force
```

## Alternative: Set Up SSH (Advanced)

If you prefer SSH, you need to:

1. Generate SSH key (if you don't have one):
   ```powershell
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```

2. Add SSH key to ssh-agent:
   ```powershell
   ssh-add $env:USERPROFILE\.ssh\id_ed25519
   ```

3. Add public key to GitHub:
   - Copy contents of `$env:USERPROFILE\.ssh\id_ed25519.pub`
   - Go to GitHub Settings > SSH and GPG keys
   - Click "New SSH key" and paste

4. Test connection:
   ```powershell
   ssh -T git@github.com
   ```

## Deployment After Git Push

Once your code is on GitHub:

1. **Render Backend:** https://dashboard.render.com
   - Click "New +" → Web Service
   - Connect GitHub
   - Select ProgressTracker repo
   - Configure as per DEPLOYMENT.md

2. **Netlify Frontend:** https://app.netlify.com
   - Click "Add new site" → Import an existing project
   - Connect GitHub
   - Select ProgressTracker repo
   - Configure as per DEPLOYMENT.md

## GitHub Token (Recommended for HTTPS)

For better security, use a Personal Access Token instead of password:

1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token"
3. Give it permission: `repo` scope
4. Copy the token
5. When git prompts for password, use the token

## Verify Setup

After pushing, verify with:

```powershell
git remote -v
git log --oneline
```

Should show your remote URL and commits.
