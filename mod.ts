interface TypedFetchOptions {
	base?: string | URL;
}

export function createTypedFetch<Paths extends Record<string, any>>(
	options: TypedFetchOptions = {},
): TypedFetch<Paths> {
	// @ts-expect-error
	return (input, init) => {
		// @ts-expect-error
		return fetch(new URL(input, options.base), init);
	};
}

type TypedResponse<Status, Response> =
	& Omit<InstanceType<typeof Response>, "status" | "json">
	& { status: Status }
	& (Response extends JsonContent<infer T> ? { json(): Promise<T> } : unknown);

type TypedRequestInit<Method, Operation> =
	& Omit<RequestInit, "method" | "body">
	& { method: Method }
	& (Operation extends { requestBody: JsonContent<infer T> } ? { body: T }
		: unknown);

type TypedFetch<Paths> = <
	Method extends keyof Paths[Path],
	Path extends keyof Paths,
>(
	input: Path,
	init: TypedRequestInit<
		Method & string,
		Paths[Path][Method]
	>,
) => InferResponse<Paths[Path][Method]>;

type InferResponse<Operation> = Operation extends { responses: infer R } ? {
		[Status in keyof R]: Promise<
			TypedResponse<NarrowStatus<Status, keyof R>, R[Status]>
		>;
	}[keyof R]
	: never;

type NarrowStatus<Status, All> = Status extends "default"
	? Exclude<HttpStatusCode, All>
	: Status;

// deno-fmt-ignore
type HttpStatusCode =
	| 100
	| 200 | 201 | 204 | 206
	| 301 | 302 | 303 | 304 | 307 | 308
	| 401 | 403 | 404 | 406 | 407 | 409 | 410 | 412 | 416 | 418 | 425 | 451
	| 500 | 501 | 502 | 503 | 504;

interface JsonContent<T> {
	content: {
		"application/json": T;
	};
}
