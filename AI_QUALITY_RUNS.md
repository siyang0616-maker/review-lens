# AI Quality Runs

## 2026-06-15 Live Smoke Test

Command:

```powershell
$env:RUN_AI_QUALITY='1'
$env:AI_QUALITY_LIMIT='3'
npm.cmd run test:ai-quality
```

Result:

```text
OpenAI API request failed: 429 insufficient_quota
```

Interpretation:

- The app reached the OpenAI API.
- The test did not complete because the OpenAI project currently has no usable quota or billing allowance.
- This is not an app schema/build failure.

Next action:

1. Check OpenAI Platform billing and project limits.
2. Confirm the key belongs to the intended project.
3. Run the same command again with `AI_QUALITY_LIMIT=3`.
4. If it passes, increase to 10, then 50.

Security note:

- The current key was pasted into chat once. After testing, rotate or revoke it in the OpenAI Platform dashboard.
