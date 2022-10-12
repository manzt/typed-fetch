interface TypedFetchOptions {
	base?: string | URL;
}

export function createTypedFetch<Paths>(
	options: TypedFetchOptions = {},
): TypedFetch<Paths> {
	return (input, init) => {
		// @ts-expect-error
		return fetch(new URL(input, options.base), init) as any;
	};
}

type TypedResponse<Status extends PropertyKey> =
	& Omit<Response, "status" | "json">
	& { status: Status };

type TypedJsonResponse<Status extends PropertyKey, T> =
	& TypedResponse<Status>
	& { json(): Promise<T> };

type TypedRequestInit<Method> = Omit<RequestInit, "method"> & {
	method: Method;
};

type TypedFetch<Paths> = <
	Method extends keyof Paths[Path],
	Path extends keyof Paths,
>(
	input: Path,
	init: TypedRequestInit<Method>,
) => Paths[Path][Method] extends { responses: infer R } ? {
		[Status in keyof R]: R[Status] extends { content: infer C }
			? C extends { "application/json": infer T } ? Promise<TypedJsonResponse<Status, T>>
			: Promise<TypedResponse<Status>>
			: never;
	}[keyof R]
	: never;
