Task;

Backend:
Stack: Vanilla JS (Node.js 12), Express.js, Apollo Server, MongoDB
2 Mutations `createEvent`, `updateEvent`, 2 Queries `event` , `events`, 1 Subscription `eventUpdated`, 1 Type (Event)

Frontend:
Stack: Next.js, React.js, Apollo Client (React) (with hooks), styled-components
3 Pages `/`, `/logout`, `/stats`

Scenario

- User comes to page 1 (home),
- Client generates a random id(bson) and saves it as lead.
- With this leadId, one "welcome" event is created with value of “1” .
- When the user comes again to page 1, the value of the same event is increased by one.
- If User comes to page 2, if there is a leadId, value of "welcome" event is decreased by one. Otherwise, user will be redirected to the page 1.
- `eventUpdated` subscription and `events` query will be used to show the latest values of events and leads on page 3.
- `event` query will be used in page one to show the current value of the “welcome” event for that leadId.