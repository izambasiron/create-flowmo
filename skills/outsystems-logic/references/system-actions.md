# OutSystems System Actions Reference

System-provided server actions for authentication, user management, and session handling.

## Authentication Actions

### User_Login
Log in a user with username and password.

```
User_Login(Username, Password, PersistLogin)
  Input: Username (Text) — The user's username or email
  Input: Password (Text) — The user's password
  Input: PersistLogin (Boolean) — If True, creates a persistent cookie
  Output: (none — sets session automatically)
  Throws: Security Exception if credentials are invalid
```

**Usage pattern:**
```
ServerAction: DoLogin
  Input: Username (Text), Password (Text), RememberMe (Boolean)

  Try
    User_Login(Username, Password, RememberMe)
    // Redirect to home screen
  Catch SecurityException
    FeedbackMessage("Invalid username or password", "error")
```

### User_Logout
Log out the current user and clear session.

```
User_Logout()
  Input: (none)
  Output: (none — clears session)
```

### User_GetUnifiedLoginUrl
Get the URL of the central login page (when using an external IdP or unified login).

```
User_GetUnifiedLoginUrl(OriginalUrl)
  Input: OriginalUrl (Text) — URL to redirect back to after login
  Output: URL (Text) — The login page URL
```

## User Management Actions

### User_CreateOrUpdate
Create a new user or update an existing one.

```
User_CreateOrUpdate(User)
  Input: User (User Record)
    - Username (Text) — Required, unique
    - Name (Text) — Display name
    - Email (Text) — Email address
    - MobilePhone (Phone Number) — Optional
    - IsActive (Boolean) — Whether the user can login
  Output: UserId (User Identifier) — The created/updated user's ID
```

### User_SetPassword
Change a user's password.

```
User_SetPassword(UserId, Password)
  Input: UserId (User Identifier) — Target user
  Input: Password (Text) — New password (must meet complexity requirements)
  Output: (none)
```

### User_ChangePassword
Change the current user's own password (requires current password).

```
User_ChangePassword(UserId, OldPassword, NewPassword)
  Input: UserId (User Identifier)
  Input: OldPassword (Text) — Current password for verification
  Input: NewPassword (Text) — New password
  Output: (none)
  Throws: Security Exception if old password is wrong
```

### User_Delete
Deactivate or delete a user account.

```
User_Delete(UserId)
  Input: UserId (User Identifier)
  Output: (none)
```

**Note**: In most OutSystems configurations, this deactivates rather than hard-deletes the user.

## Session & Identity

### GetUserId
Get the current logged-in user's identifier.

```
GetUserId()
  Output: UserId (User Identifier)
  Note: Returns NullIdentifier() if no user is logged in
```

### GetUserName
Get the current user's username.

```
GetUserName()
  Output: Username (Text)
```

### GetExternalLoginURL
Get the URL for external authentication providers (SAML, OAuth, etc.).

```
GetExternalLoginURL(ProviderName)
  Input: ProviderName (Text) — e.g., "AzureAD", "Okta"
  Output: URL (Text)
```

## Role Management

### GrantRole
Assign a role to a user.

```
GrantRole(UserId, RoleId)
  Input: UserId (User Identifier)
  Input: RoleId (Role Identifier) — e.g., Entities.Role.Admin
  Output: (none)
```

### RevokeRole
Remove a role from a user.

```
RevokeRole(UserId, RoleId)
  Input: UserId (User Identifier)
  Input: RoleId (Role Identifier)
  Output: (none)
```

### CheckRole
Check if a user has a specific role.

```
CheckRole(UserId, RoleId)
  Input: UserId (User Identifier)
  Input: RoleId (Role Identifier)
  Output: HasRole (Boolean)
```

**Shortcut**: Auto-generated `Check<RoleName>Role()` functions check the current user.

## Common Patterns

### Registration Flow
```
ServerAction: Register
  Input: Username, Password, Name, Email

  // 1. Create user
  NewUser = CreateUser(Username, Name, Email, IsActive: True)
  UserId = User_CreateOrUpdate(NewUser)

  // 2. Set password
  User_SetPassword(UserId, Password)

  // 3. Assign default role
  GrantRole(UserId, Entities.Role.RegisteredUser)

  // 4. Auto-login
  User_Login(Username, Password, PersistLogin: False)
```

### Password Reset Flow
```
ServerAction: ResetPassword
  Input: UserId, NewPassword

  // 1. Validate token (custom logic — not built-in)
  If not ValidateResetToken(UserId, Token)
    Raise User Exception "Invalid or expired reset link"
  End If

  // 2. Set new password
  User_SetPassword(UserId, NewPassword)

  // 3. Invalidate token
  InvalidateResetToken(UserId, Token)
```

### Authorization Check Pattern
```
ServerAction: EnsureAuthorized
  Input: RequiredRole (Role Identifier)

  If GetUserId() = NullIdentifier()
    Raise Security Exception "Not authenticated"
  End If

  If not CheckRole(GetUserId(), RequiredRole)
    Raise Security Exception "Insufficient permissions"
  End If
```

## Platform Differences

| Feature | O11 | ODC |
|---------|-----|-----|
| User entity | `System.User` | Built-in User entity |
| Roles | Defined per module, granted at runtime | Defined in ODC Portal, managed via API |
| External auth | Users module + IdP config | Built-in OIDC/SAML in ODC Portal |
| Session storage | Server-side session | Stateless JWT tokens |
| User_Login | Creates server session + cookie | Returns JWT token |
| Multi-tenant | `TenantId` on Site entities | Separate ODC organizations |
