# OutSystems SQL — Common Query Patterns

Both O11 and ODC use `{Entity}.[Attribute]` notation. ODC-specific differences are noted inline.

## CRUD — Create

**O11:**
```sql
INSERT INTO {Entity} ([Attr1], [Attr2], [CreatedDate])
VALUES (@Param1, @Param2, GETDATE())
```

**ODC:**
```sql
INSERT INTO {Entity} ([Attr1], [Attr2], [CreatedDate])
VALUES (@Param1, @Param2, NOW())
```
> Note: For **internal entities**, ODC drops the entity prefix in the column list — `([Attr])` not `({Entity}.[Attr])`. For **external entities (ANSI-92)**, qualifying with `{Entity}.[Attr]` in the column list is recommended.

## CRUD — Read with Join

**O11:**
```sql
SELECT {Order}.[Id], {Order}.[Total], {Customer}.[Name]
FROM {Order}
INNER JOIN {Customer} ON {Customer}.[Id] = {Order}.[CustomerId]
WHERE {Order}.[Status] = @Status
ORDER BY {Order}.[CreatedDate] DESC
```

**ODC:**
```sql
SELECT {Order}.[Id], {Order}.[Total], {Customer}.[Name]
FROM {Order}
INNER JOIN {Customer} ON {Customer}.[Id] = {Order}.[CustomerId]
WHERE {Order}.[Status] = @Status
ORDER BY {Order}.[CreatedDate] DESC
```
> Same notation as O11. JOIN, WHERE, ORDER BY work identically.

## CRUD — Update

**O11:**
```sql
UPDATE {Entity}
SET {Entity}.[Attr1] = @NewValue, {Entity}.[ModifiedDate] = GETDATE()
WHERE {Entity}.[Id] = @Id
```

**ODC:**
```sql
UPDATE {Entity}
SET [Attr1] = @NewValue, [ModifiedDate] = NOW()
WHERE {Entity}.[Id] = @Id
```
> Note: ODC UPDATE drops the entity prefix in the SET clause — `SET [Attr] = val` not `SET {Entity}.[Attr] = val`.

## CRUD — Delete (Soft)

**O11:**
```sql
UPDATE {Entity}
SET {Entity}.[IsActive] = 0, {Entity}.[DeletedDate] = GETDATE()
WHERE {Entity}.[Id] = @Id
```

**ODC:**
```sql
UPDATE {Entity}
SET [IsActive] = 0, [DeletedDate] = NOW()
WHERE {Entity}.[Id] = @Id
```

## Aggregation with Group By

**O11:**
```sql
SELECT {Category}.[Name], COUNT(*) AS Total, SUM({Product}.[Price]) AS Revenue
FROM {Product}
INNER JOIN {Category} ON {Category}.[Id] = {Product}.[CategoryId]
WHERE {Product}.[IsActive] = 1
GROUP BY {Category}.[Name]
HAVING COUNT(*) > 5
ORDER BY Revenue DESC
```

**ODC:**
```sql
SELECT {Category}.[Name], COUNT(*) AS Total, SUM({Product}.[Price]) AS Revenue
FROM {Product}
INNER JOIN {Category} ON {Category}.[Id] = {Product}.[CategoryId]
WHERE {Product}.[IsActive] = 1
GROUP BY {Category}.[Name]
HAVING COUNT(*) > 5
ORDER BY Revenue DESC
```
> Same notation as O11. Aggregation, GROUP BY, and HAVING work identically.

## Pagination

**O11:**
```sql
SELECT {Entity}.[Id], {Entity}.[Name]
FROM {Entity}
ORDER BY {Entity}.[Name]
OFFSET @StartIndex ROWS
FETCH NEXT @MaxRecords ROWS ONLY
```

**ODC:**
```sql
SELECT {Entity}.[Id], {Entity}.[Name]
FROM {Entity}
ORDER BY {Entity}.[Name]
LIMIT @MaxRecords OFFSET @StartIndex
```

## Subquery / EXISTS

**O11:**
```sql
SELECT {Customer}.[Id], {Customer}.[Name]
FROM {Customer}
WHERE EXISTS (
  SELECT 1 FROM {Order}
  WHERE {Order}.[CustomerId] = {Customer}.[Id]
    AND {Order}.[Total] > 1000
)
```

**ODC:**
```sql
SELECT {Customer}.[Id], {Customer}.[Name]
FROM {Customer}
WHERE EXISTS (
  SELECT 1 FROM {Order}
  WHERE {Order}.[CustomerId] = {Customer}.[Id]
    AND {Order}.[Total] > 1000
)
```
> Same notation as O11. EXISTS and subqueries work identically.

## CTE (Common Table Expression)

**O11:**
```sql
WITH RecentOrders AS (
  SELECT {Order}.[CustomerId], MAX({Order}.[CreatedDate]) AS LastOrder
  FROM {Order}
  GROUP BY {Order}.[CustomerId]
)
SELECT {Customer}.[Name], ro.LastOrder
FROM {Customer}
INNER JOIN RecentOrders ro ON ro.[CustomerId] = {Customer}.[Id]
```

**ODC:**
```sql
WITH RecentOrders AS (
  SELECT {Order}.[CustomerId], MAX({Order}.[CreatedDate]) AS LastOrder
  FROM {Order}
  GROUP BY {Order}.[CustomerId]
)
SELECT {Customer}.[Name], ro.LastOrder
FROM {Customer}
INNER JOIN RecentOrders ro ON ro.[CustomerId] = {Customer}.[Id]
```
> Same notation as O11. CTEs are supported in ODC SQL nodes.
