<script lang="ts">
    interface Props {
        headers: [string, string][];
        rows: string[][];
        sortValue: string;
        onChangeSortValue: (sortName: string) => void;
        initialSortOrder?: "asc" | "desc";
    }

    const {
        headers,
        rows,
        sortValue,
        onChangeSortValue: onChangeSort,
        initialSortOrder = "asc",
    }: Props = $props();

    let sortOrder = $state(initialSortOrder);

    function onSortClick(sortName: string) {
        if (sortValue === sortName) {
            sortOrder = sortOrder === "asc" ? "desc" : "asc";
        } else {
            onChangeSort(sortName);
            sortOrder = "asc";
        }
    }

    const orderedRows = $derived(
        sortOrder === "desc" ? rows.toReversed() : rows,
    );
</script>

<table>
    <thead>
        <tr>
            {#each headers as [header, sortName]}
                <th
                    data-sort={sortValue === sortName ? sortOrder : null}
                    onclick={() => onSortClick(sortName)}
                >
                    {header}
                </th>
            {/each}
        </tr>
    </thead>
    <tbody>
        <!-- TODO add either lazy scroll or pagination -->
        {#each orderedRows.slice(0, 50) as row}
            <tr>
                {#each row as cell}
                    <td>{cell}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
        min-width: 100%;
        border-collapse: collapse;
        border: 2px solid black;
        font-size: 1.5rem;
    }

    thead {
        position: sticky;
        top: 0;
        background-color: white;
        border-bottom: 2px solid black;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        z-index: 1;
    }

    th,
    td {
        text-align: center;
        border: 1px solid black;
        padding: 0.8em 1em;
    }

    th {
        cursor: pointer;
    }

    th[data-sort="asc"]::after {
        content: " ▲";
        position: absolute;
    }
    th[data-sort="desc"]::after {
        content: " ▼";
        position: absolute;
    }
</style>
