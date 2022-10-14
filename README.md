# @manzt/typed-fetch

A type-only experiment to conditionally impose strictness over the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) based on OpenAPI Schemas

## Usage

```typescript
import { createTypedFetch } from "@manzt/typed-fetch";
import type { paths } from "./schema"; // generated via `openapi-typescript`

let tfetch = createTypedFetch<paths>({
	base: "http://localhost:5000",
});

let res = await tfetch("/pets", { method: "get" });
if (res.status === 200) {
	let pets = await res.json();
} else {
	let { code, message } = await res.json();
}
```
