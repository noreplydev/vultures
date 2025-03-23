export class HostsRepository {
    constructor() { }

    static async create(apiPrefix: string, hostname: string): Promise<boolean> {
        try {
            const result: any = await fetch(apiPrefix + "/hosts", {
                method: "POST",
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({ hostname, createdAt: Date.now() })
            })

            if (result["isError"]) {
                return false
            }

            return true
        } catch (err) {
            return false
        }
    }
}