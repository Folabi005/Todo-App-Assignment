# ER Diagram

## Entities

User
- _id (PK)
- username
- password

Task
- _id (PK)
- title
- status
- user (FK -> User._id)
- createdAt
- updatedAt

## Relationships

- User 1 : N Task
  - A user can own many tasks.
  - Each task belongs to exactly one user.

## Diagram

```
+---------+      +-------+
|  User   |      | Task  |
+---------+      +-------+
| _id PK  |<-----| user  |
| username|      | title |
| password|      | status|
+---------+      +-------+
```
