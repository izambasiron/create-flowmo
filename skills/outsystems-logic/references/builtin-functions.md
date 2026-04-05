# OutSystems Built-in Functions Reference

Complete reference for all built-in functions available in OutSystems expressions.

## Data Conversion

| Function | Description | Example |
|----------|-------------|---------|
| `BooleanToInteger(b)` | Boolean → Integer (True=1, False=0) | `BooleanToInteger(IsActive)` → `1` |
| `BooleanToText(b)` | Boolean → "True" / "False" | `BooleanToText(True)` → `"True"` |
| `DateTimeToDate(dt)` | DateTime → Date (strips time) | `DateTimeToDate(CurrDateTime())` |
| `DateTimeToText(dt)` | DateTime → Text (default format) | `DateTimeToText(CurrDateTime())` |
| `DateTimeToTime(dt)` | DateTime → Time (strips date) | `DateTimeToTime(CurrDateTime())` |
| `DateToDateTime(d)` | Date → DateTime (time = 00:00:00) | `DateToDateTime(CurrDate())` |
| `DateToText(d)` | Date → Text | `DateToText(CurrDate())` |
| `DecimalToBoolean(d)` | Decimal → Boolean (0=False, else True) | `DecimalToBoolean(1.5)` → `True` |
| `DecimalToInteger(d)` | Decimal → Integer (truncates) | `DecimalToInteger(3.7)` → `3` |
| `DecimalToLongInteger(d)` | Decimal → Long Integer | `DecimalToLongInteger(3.7)` → `3` |
| `DecimalToText(d)` | Decimal → Text | `DecimalToText(3.14)` → `"3.14"` |
| `IntegerToBoolean(i)` | Integer → Boolean (0=False) | `IntegerToBoolean(1)` → `True` |
| `IntegerToDecimal(i)` | Integer → Decimal | `IntegerToDecimal(5)` → `5.0` |
| `IntegerToText(i)` | Integer → Text | `IntegerToText(42)` → `"42"` |
| `LongIntegerToInteger(l)` | Long Integer → Integer (may overflow) | `LongIntegerToInteger(100)` |
| `LongIntegerToText(l)` | Long Integer → Text | `LongIntegerToText(100)` → `"100"` |
| `NullDate()` | Returns null date (#1900-01-01#) | `If(Date = NullDate(), ...)` |
| `NullIdentifier()` | Returns null identifier for any Id type | `CustomerId = NullIdentifier()` |
| `NullObject()` | Returns null object reference | `NullObject()` |
| `NullTextIdentifier()` | Returns null text identifier ("") | `NullTextIdentifier()` |
| `TextToDate(t)` | Text → Date | `TextToDate("2024-01-15")` |
| `TextToDateTime(t)` | Text → DateTime | `TextToDateTime("2024-01-15 14:30:00")` |
| `TextToDecimal(t)` | Text → Decimal | `TextToDecimal("3.14")` → `3.14` |
| `TextToIdentifier(t)` | Text → Identifier | `TextToIdentifier("abc-123")` |
| `TextToInteger(t)` | Text → Integer | `TextToInteger("42")` → `42` |
| `TextToLongInteger(t)` | Text → Long Integer | `TextToLongInteger("1000000")` |
| `TextToTime(t)` | Text → Time | `TextToTime("14:30:00")` |
| `TimeToText(t)` | Time → Text | `TimeToText(CurrTime())` |
| `ToObject(x)` | Any → Object | `ToObject(MyRecord)` |

## Date and Time

| Function | Description | Example |
|----------|-------------|---------|
| `CurrDate()` | Current date (server) | `CurrDate()` |
| `CurrDateTime()` | Current date+time (server) | `CurrDateTime()` |
| `CurrTime()` | Current time (server) | `CurrTime()` |
| `Year(d)` | Extract year | `Year(CurrDate())` → `2024` |
| `Month(d)` | Extract month (1-12) | `Month(CurrDate())` → `6` |
| `Day(d)` | Extract day (1-31) | `Day(CurrDate())` → `15` |
| `Hour(t)` | Extract hour (0-23) | `Hour(CurrTime())` → `14` |
| `Minute(t)` | Extract minute (0-59) | `Minute(CurrTime())` → `30` |
| `Second(t)` | Extract second (0-59) | `Second(CurrTime())` → `45` |
| `AddDays(d, n)` | Add n days to date | `AddDays(CurrDate(), 7)` |
| `AddHours(dt, n)` | Add n hours to datetime | `AddHours(CurrDateTime(), 2)` |
| `AddMinutes(dt, n)` | Add n minutes to datetime | `AddMinutes(CurrDateTime(), 30)` |
| `AddMonths(d, n)` | Add n months | `AddMonths(CurrDate(), 3)` |
| `AddSeconds(dt, n)` | Add n seconds | `AddSeconds(CurrDateTime(), 60)` |
| `AddYears(d, n)` | Add n years | `AddYears(CurrDate(), 1)` |
| `DiffDays(d1, d2)` | Difference in days | `DiffDays(StartDate, EndDate)` |
| `DiffHours(dt1, dt2)` | Difference in hours | `DiffHours(Start, End)` |
| `DiffMinutes(dt1, dt2)` | Difference in minutes | `DiffMinutes(Start, End)` |
| `DiffMonths(d1, d2)` | Difference in months | `DiffMonths(Start, End)` |
| `DiffSeconds(dt1, dt2)` | Difference in seconds | `DiffSeconds(Start, End)` |
| `DiffYears(d1, d2)` | Difference in years | `DiffYears(Start, End)` |
| `BuildDateTime(d, t)` | Combine Date + Time → DateTime | `BuildDateTime(CurrDate(), CurrTime())` |
| `NewDate(y, m, d)` | Construct a Date | `NewDate(2024, 12, 25)` |
| `NewDateTime(y, m, d, h, mi, s)` | Construct a DateTime | `NewDateTime(2024, 12, 25, 0, 0, 0)` |
| `NewTime(h, m, s)` | Construct a Time | `NewTime(14, 30, 0)` |
| `DayOfWeek(d)` | Day of week (0=Sun, 6=Sat) | `DayOfWeek(CurrDate())` |

## Math

| Function | Description | Example |
|----------|-------------|---------|
| `Abs(n)` | Absolute value | `Abs(-5)` → `5` |
| `Ceiling(d)` | Round up | `Ceiling(3.2)` → `4` |
| `Floor(d)` | Round down | `Floor(3.8)` → `3` |
| `Round(d, decimals)` | Round to N decimals | `Round(3.456, 2)` → `3.46` |
| `Trunc(d)` | Truncate decimal | `Trunc(3.9)` → `3` |
| `Max(a, b)` | Larger value | `Max(10, 20)` → `20` |
| `Min(a, b)` | Smaller value | `Min(10, 20)` → `10` |
| `Power(base, exp)` | Exponent | `Power(2, 3)` → `8` |
| `Sqrt(n)` | Square root | `Sqrt(16)` → `4` |
| `Log(n)` | Natural log | `Log(2.718)` → `1.0` |
| `Mod(a, b)` | Modulo/remainder | `Mod(10, 3)` → `1` |

## Text

| Function | Description | Example |
|----------|-------------|---------|
| `Chr(n)` | ASCII code → character | `Chr(65)` → `"A"` |
| `Concat(t1, t2)` | Concatenate two texts | `Concat("Hello", " World")` |
| `Index(t, search, start)` | Find position (0-based) | `Index("Hello", "ll", 0)` → `2` |
| `Length(t)` | String length | `Length("Hello")` → `5` |
| `NewLine()` | Line break character | `"Line1" + NewLine() + "Line2"` |
| `Replace(text, search, replace)` | Replace occurrences | `Replace("Hello", "l", "r")` → `"Herro"` |
| `Substr(t, start, length)` | Substring (0-based start) | `Substr("Hello", 0, 3)` → `"Hel"` |
| `ToLower(t)` | Lowercase | `ToLower("HELLO")` → `"hello"` |
| `ToUpper(t)` | Uppercase | `ToUpper("hello")` → `"HELLO"` |
| `Trim(t)` | Remove leading/trailing whitespace | `Trim("  hi  ")` → `"hi"` |
| `TrimStart(t)` | Remove leading whitespace | `TrimStart("  hi")` → `"hi"` |
| `TrimEnd(t)` | Remove trailing whitespace | `TrimEnd("hi  ")` → `"hi"` |

## Format

| Function | Description | Example |
|----------|-------------|---------|
| `FormatCurrency(value, symbol, decimals, decSep, thousSep)` | Format as currency | `FormatCurrency(1234.5, "$", 2, ".", ",")` → `"$1,234.50"` |
| `FormatDateTime(dt, format)` | Format datetime | `FormatDateTime(CurrDateTime(), "yyyy-MM-dd")` |
| `FormatDecimal(d, decimals, decSep, thousSep)` | Format decimal | `FormatDecimal(1234.5, 2, ".", ",")` → `"1,234.50"` |
| `FormatPercent(d, decimals)` | Format as percentage | `FormatPercent(0.85, 1)` → `"85.0%"` |
| `FormatPhoneNumber(phone, locale)` | Format phone number | `FormatPhoneNumber("+1234567890", "en-US")` |
| `FormatText(t, format)` | Apply text format | `FormatText("hello", "uppercase")` |

## Email Validation

| Function | Description |
|----------|-------------|
| `EmailAddressValidate(email)` | Returns True if valid email format |

## URL

| Function | Description | Example |
|----------|-------------|---------|
| `EncodeURL(t)` | URL-encode text | `EncodeURL("hello world")` → `"hello%20world"` |
| `DecodeURL(t)` | URL-decode text | `DecodeURL("hello%20world")` → `"hello world"` |
| `GetBookmarkableURL()` | Get current screen URL | `GetBookmarkableURL()` |

## Organization

| Function | Description |
|----------|-------------|
| `GetCurrentLocale()` | Returns the current user's locale (e.g., "en-US") |
| `GetAppName()` | Returns the current application name |
| `GetOwnerURLPath()` | Returns the base URL path of the application |
| `GetExceptionURL()` | Returns the URL of the exception handler page |

## Roles

| Function | Description | Example |
|----------|-------------|---------|
| `CheckRole(RoleName)` | Check if current user has role | `CheckRole(Entities.Role.Admin)` |
| `Check<RoleName>Role()` | Auto-generated per role | `CheckAdminRole()` |
| `GetUserId()` | Current logged-in user's ID | `GetUserId()` |
| `GetUserName()` | Current user's username | Return type: Text |
