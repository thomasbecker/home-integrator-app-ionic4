export class CommonHighChartsSettings {
    static getTrendPlotOptions() {
        return {
            series: {
                fillOpacity: 0.1,
                dataLabels: {
                    format: '{point.y:.2f}',
                    enabled: true,
                    allowOverlap: false,
                    shadow: false,
                    style: {
                        textOutline: null,
                        color: 'black'
                    }
                }
            }
        };
    }
}
