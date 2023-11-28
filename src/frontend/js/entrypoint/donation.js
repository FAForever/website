import Highcharts from 'highcharts'

Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: true,
        backgroundColor: 'transparent',
        type: 'pie'

    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    title: {
        text: 'How FAF Uses Donations',
        style: {
            color: '#ffffff',
            fontSize: '30px',
            fontFamily: 'electrolize'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        enabled: false
    },
    plotOptions: {
        pie: {
            allowPointSelect: false,
            cursor: 'pointer',

            dataLabels: {
                color: '#ffffff',
                font: '20px electrolize',
                enabled: true,
                format: '<h2>{point.name}</h2>: {point.percentage:.1f} %',
                style: {
                    fontSize: '18px',
                    fontFamily: 'electrolize'
                }
            }
        }
    },
    dataLabels: {
        style: {
            color: '#ffffff'
        }
    },
    series: [{
        name: 'Expenses',
        colorByPoint: true,
        color: '#ffffff',

        data: [{
            name: 'Infrastructure Costs',
            y: 56,
            sliced: true,
            color: '#7376a8',
            selected: true

        }, {
            name: 'Tournament Prizes',
            y: 44,
            color: '#dadada',
            selected: true
        }]
    }]
})
