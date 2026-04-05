# OutSystems Libraries Reference

System libraries that provide additional utility functions. Import these modules to use their functions in Server Actions and expressions.

## BinaryData

Functions for working with binary/blob data.

| Function | Description |
|----------|-------------|
| `BinaryDataToText(data, encoding)` | Convert binary to text with specified encoding (UTF-8, ASCII, etc.) |
| `TextToBinaryData(text, encoding)` | Convert text to binary data |
| `BinaryDataSize(data)` | Returns the size in bytes |
| `BinaryToBase64(data)` | Encode binary as Base64 string |
| `Base64ToBinary(text)` | Decode Base64 string to binary |
| `Compare(data1, data2)` | Compare two binary values (returns 0 if equal) |
| `ConvertEncoding(data, srcEncoding, dstEncoding)` | Convert between text encodings |

## DateTime

Extended date/time manipulation beyond built-in functions.

| Function | Description |
|----------|-------------|
| `DiffWeeks(d1, d2)` | Difference in weeks |
| `IsLeapYear(year)` | Check if year is a leap year |
| `DaysInMonth(year, month)` | Number of days in a month |
| `FirstDayOfWeek(d)` | Get the first day (Monday) of the week containing date |
| `LastDayOfMonth(d)` | Get the last day of the month |
| `StartOfDay(dt)` | DateTime with time set to 00:00:00 |
| `EndOfDay(dt)` | DateTime with time set to 23:59:59 |

## HTTP

HTTP request and response handling for REST and web interactions.

| Function | Description |
|----------|-------------|
| `GetRequestHeader(name)` | Get value of an HTTP request header |
| `SetRequestHeader(name, value)` | Set an HTTP request header |
| `GetResponseHeader(name)` | Get value of an HTTP response header |
| `GetRequestContent()` | Get the raw request body |
| `GetRawURL()` | Get the full request URL |
| `GetFormValue(name)` | Get a form field value from POST data |
| `GetURLMethod()` | Get the HTTP method (GET, POST, etc.) |
| `SetStatusCode(code)` | Set the HTTP response status code |
| `SetCookie(name, value, expires)` | Set an HTTP cookie |
| `GetCookie(name)` | Get a cookie value |
| `URLEncode(text)` | URL-encode a text value |
| `URLDecode(text)` | URL-decode a text value |

## Sanitization

Security-related functions for preventing XSS, SQL injection, and other attacks.

| Function | Description |
|----------|-------------|
| `SanitizeHtml(html)` | Remove dangerous HTML tags/attributes, keep safe formatting |
| `VerifyJavascriptLiteral(text)` | Escape text for safe use in JavaScript strings |
| `BuildSafe_InClauseIntegerList(idList)` | Safely build SQL IN clause from integer list |
| `BuildSafe_InClauseTextList(textList)` | Safely build SQL IN clause from text list |

## Security

Cryptographic and security utility functions.

| Function | Description |
|----------|-------------|
| `GenerateSecurePassword()` | Generate a cryptographically secure random password |
| `ComputeMAC(data, key, algorithm)` | Compute Message Authentication Code (HMAC) |
| `CryptoEncrypt(plainText, key)` | Encrypt text using AES |
| `CryptoDecrypt(cipherText, key)` | Decrypt AES-encrypted text |
| `ComputeHash(data, algorithm)` | Compute hash (MD5, SHA-256, SHA-512) |
| `JWT_CreateToken(header, payload, key)` | Create a JSON Web Token (ODC) |
| `JWT_VerifyToken(token, key)` | Verify and decode a JWT (ODC) |

## Text

Extended text manipulation functions.

| Function | Description |
|----------|-------------|
| `Format(text, args)` | String formatting with placeholders |
| `Join(list, separator)` | Join list elements into a single text |
| `Split(text, separator)` | Split text into a list |
| `PadLeft(text, totalWidth, paddingChar)` | Pad text on the left |
| `PadRight(text, totalWidth, paddingChar)` | Pad text on the right |
| `Regex_Replace(text, pattern, replacement)` | Replace using regex |
| `Regex_Search(text, pattern)` | Search for regex match |
| `Regex_IsMatch(text, pattern)` | Check if regex matches |
| `StringBuilder_Create()` | Create a string builder for efficient concatenation |
| `StringBuilder_Append(sb, text)` | Append text to string builder |
| `StringBuilder_ToString(sb)` | Get final text from string builder |
| `String_LastIndexOf(text, search)` | Find last occurrence position |
| `String_StartsWith(text, prefix)` | Check if text starts with prefix |
| `String_EndsWith(text, suffix)` | Check if text ends with suffix |
| `String_Contains(text, search)` | Check if text contains substring |

## TextDictionary

Key-value pair storage (dictionary/map data structure).

| Function | Description |
|----------|-------------|
| `TextDictionary_Create()` | Create a new dictionary |
| `TextDictionary_Set(dict, key, value)` | Set a key-value pair |
| `TextDictionary_Get(dict, key)` | Get value by key |
| `TextDictionary_Remove(dict, key)` | Remove a key |
| `TextDictionary_ContainsKey(dict, key)` | Check if key exists |
| `TextDictionary_Count(dict)` | Number of entries |
| `TextDictionary_Keys(dict)` | Get all keys as a list |
| `TextDictionary_Values(dict)` | Get all values as a list |

## URL

URL parsing and construction.

| Function | Description |
|----------|-------------|
| `GetRelativeURL(absoluteURL)` | Extract the relative path from an absolute URL |
| `GetAbsoluteURL(relativeURL)` | Construct absolute URL from relative path |
| `GetURLHost(url)` | Extract the host from a URL |
| `GetURLProtocol(url)` | Extract the protocol (http/https) |
| `GetURLPath(url)` | Extract the path component |
| `GetURLQueryString(url)` | Extract the query string |
| `AddURLParameter(url, name, value)` | Append a query parameter |

## XML

XML parsing and generation.

| Function | Description |
|----------|-------------|
| `XmlDocument_Load(xml)` | Parse XML string into document |
| `XmlDocument_GetRootNode(doc)` | Get the root element |
| `XmlNode_GetChildNodes(node)` | Get child nodes |
| `XmlNode_GetAttribute(node, name)` | Get attribute value |
| `XmlNode_GetInnerText(node)` | Get text content |
| `XmlNode_SelectNodes(node, xpath)` | Query nodes by XPath |
| `XmlDocument_Save(doc)` | Convert document back to XML string |
| `Xsl_Transform(xml, xslt)` | Apply XSLT transformation |

## Zip

File compression and decompression.

| Function | Description |
|----------|-------------|
| `Zip_Create()` | Create a new zip archive |
| `Zip_AddFile(zip, fileName, content)` | Add a file to the archive |
| `Zip_GetBinary(zip)` | Get the zip as binary data |
| `Zip_Open(binaryData)` | Open a zip from binary data |
| `Zip_GetFileList(zip)` | List files in the archive |
| `Zip_GetFile(zip, fileName)` | Extract a specific file |

## Math (Extended)

Additional math functions beyond the built-in set.

| Function | Description |
|----------|-------------|
| `Random(min, max)` | Generate random integer in range |
| `PI()` | Returns π (3.14159...) |
| `Sin(angle)` | Sine |
| `Cos(angle)` | Cosine |
| `Tan(angle)` | Tangent |
| `Asin(value)` | Arc sine |
| `Acos(value)` | Arc cosine |
| `Atan(value)` | Arc tangent |
