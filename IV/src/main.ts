import { Actor } from "apify";
import axios from "axios";

interface Input {
    task: string;
    memory: number;
    useClient: boolean;
    fields: string[];
    maxItems: number;
}

Actor.main(async () => {
    const input: Input = (await Actor.getInput()) as any;
    if (input === null) throw new Error("Missing input");
    console.log("Input: ", input);

    const taskOptions = {
        memory: input.memory,
        format: "csv",
        token: "apify_api_jL0yrmOgqQLqJuijLJfSwjxLa4DPwl0PZY3M",
    };
    const downloadOptions = { fields: input.fields.join(","), limit: input.maxItems };

    let data;
    if (input.useClient) {
        const client = Actor.newClient({ token: taskOptions.token });

        const task = client.task(input.task);
        const { defaultDatasetId } = await task.call(undefined, { memory: input.memory });

        const datasetClient = await client.dataset(defaultDatasetId);
        data = await datasetClient.downloadItems(taskOptions.format as any, {
            ...downloadOptions,
            fields: input.fields,
        });
    } else {
        const res = await axios({
            url: `https://api.apify.com/v2/actor-tasks/${input.task}/run-sync-get-dataset-items`,
            params: {
                ...downloadOptions,
                ...taskOptions,
            },
        });
        data = res.data;
    }

    const keyStore = await Actor.openKeyValueStore();
    await keyStore.setValue("OUTPUT", data, { contentType: "text/csv" });
});
