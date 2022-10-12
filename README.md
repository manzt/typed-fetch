# @manzt/typed-fetch

WIP

```bash
pnpm install @manzt/typed-fetch
```

```typescript
import { createTypedFetch } from "@manzt/typed-fetch";
import type { paths } from "./schema";

let tfetch = createTypedFetch<paths>({
	base: "http://localhost:5000",
});

async function get() {
	let res = await tfetch("/pets", { method: "get" });
	if (res.status === 200) {
		let pets = await res.json();
	} else {
		let { code, message } = await res.json();
	}
}

async function post() {
	let res = await tfetch("/pets", { method: "post" });
}
```
