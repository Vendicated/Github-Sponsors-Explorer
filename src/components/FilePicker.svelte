<script lang="ts">
    import {
        sponsors,
        sponsorsFileContent,
        sponsorsFileHandle,
    } from "../appState.svelte";
    import { parseSponsors } from "../parser";

    async function onSelectFile() {
        const [handle] = await window.showOpenFilePicker({
            multiple: false,
            types: [
                {
                    description: "Text Files",
                    accept: {
                        "application/json": [".json"],
                        "text/csv": [".csv"],
                    },
                },
            ],
        });

        const permission = await handle.requestPermission({ mode: "read" });
        if (permission === "granted") {
            sponsorsFileHandle.set(handle);
            onGo();
        } else {
            alert("You need to grant permission to read the file!");
        }
    }

    async function onGo() {
        if (!$sponsorsFileHandle) return;

        await $sponsorsFileHandle.requestPermission({ mode: "read" });
        const file = await $sponsorsFileHandle.getFile();

        sponsorsFileContent.value = await file.text();
        sponsors.value = parseSponsors(
            sponsorsFileContent.value,
            $sponsorsFileHandle.name.endsWith(".csv") ? "csv" : "json",
        );
    }
</script>

<div>
    <h2>Select a File to get started!</h2>
    <button onclick={onSelectFile}>
        {$sponsorsFileHandle?.name ?? "Select a File"}
    </button>
    <button onclick={onGo}>Go</button>
</div>

<style>
    button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        border-radius: 8px;
    }
</style>
