# Auth Testing

Admin login (single owner password, JWT bearer token):

```
curl -X POST https://nocap-platform.preview.emergentagent.com/api/auth/login \
  -H "Content-Type: application/json" -d '{"password":"<ADMIN_PASSWORD from backend/.env>"}'
# -> {"token":"..."}

TOKEN=<token>
curl https://nocap-platform.preview.emergentagent.com/api/auth/me -H "Authorization: Bearer $TOKEN"
# -> {"role":"admin"}

# Guarded routes without a token must 401:
curl -o /dev/null -w "%{http_code}\n" -X PUT https://nocap-platform.preview.emergentagent.com/api/content \
  -H "Content-Type: application/json" -d '{"data":{}}'
curl -o /dev/null -w "%{http_code}\n" -X POST https://nocap-platform.preview.emergentagent.com/api/uploads

# Wrong password 5 times from one IP -> 429 lockout for 15 min (login_attempts collection).
```
