<script lang="ts">
    import { alpha3ToCountryName, alpha3ToEmoji } from "../utils/countries";

    export interface FlagWithTooltipProps {
        countryAlpha3: string;
    }

    const { countryAlpha3 }: FlagWithTooltipProps = $props();
</script>

<span title={alpha3ToCountryName(countryAlpha3)}>
    {alpha3ToEmoji(countryAlpha3)}
</span>
