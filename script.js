var table = $('#table');
var exportBtn = $('#export_btn');
var lineChartBtn = $('#line_chart_btn');
var pieChartBtn = $('#pie_chart_btn');
var exportDiv = $('#exportDiv');

// TABLE

$('.table-add').click(function () {
    var $clone = table.find('tr.hide').clone(true).removeClass('hide table-line');
    table.find('table').append($clone);
});

$('.table-remove').click(function () {
    $(this).parents('tr').detach();
});

$('.table-up').click(function () {
    var $row = $(this).parents('tr');
    if ($row.index() === 1) return; // Don't go above the header
    $row.prev().before($row.get(0));
});

$('.table-down').click(function () {
    var $row = $(this).parents('tr');
    $row.next().after($row.get(0));
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;


// GET DATA FROM TABLE

function getDataFromTable() {
    var $rows = table.find('tr:not(:hidden)');
    var headers = [];
    var data = [];

    // Get the headers (add special header logic here)
    $($rows.shift()).find('th:not(:empty)').each(function () {
        headers.push($(this).text().toLowerCase());
    });

    // Turn all existing rows into a loopable array
    $rows.each(function () {
        var $td = $(this).find('td');
        var h = {};

        // Use the headers from earlier to name our hash keys
        headers.forEach(function (header, i) {
            h[header] = $td.eq(i).text();
        });

        data.push(h);
    });

    return data;
}

// BUTTONS

exportBtn.click(function () {
    // var $rows = table.find('tr:not(:hidden)');
    // var headers = [];
    // var data = [];
    //
    // // Get the headers (add special header logic here)
    // $($rows.shift()).find('th:not(:empty)').each(function () {
    //     headers.push($(this).text().toLowerCase());
    // });
    //
    // // Turn all existing rows into a loopable array
    // $rows.each(function () {
    //     var $td = $(this).find('td');
    //     var h = {};
    //
    //     // Use the headers from earlier to name our hash keys
    //     headers.forEach(function (header, i) {
    //         h[header] = $td.eq(i).text();
    //     });
    //
    //     data.push(h);
    // });

    // Output the result
    // exportDiv.text(JSON.stringify(data));
});

lineChartBtn.click(function() {
    $(".charts-container").find("canvas").remove();
    $(".charts-container").append("<canvas id='line_chart' class='chart' width='600' height='200'></canvas>");
    nameForChart = $('#line_chart');
    labelForChart = 'Аналіз коштів';
    showLineChart(getDataFromTable());
});
pieChartBtn.click(function() {
    $(".charts-container").find("canvas").remove();
    $(".charts-container").append("<canvas id='pie_chart' class='chart' width='500' height='200'></canvas>");
    showPieChart(getDataFromTable());
});

// CHARTS

// line chart

function showLineChart(json) {
    var dateData = [],
        koshtuData = [];

    for (var i = 0; i < json.length; i++) {
        dateData.push(json[i].дата);
        koshtuData.push(json[i].кошти);
    }

    drawLineChart(nameForChart, labelForChart, dateData, koshtuData);
}

function drawLineChart(currentChart, label, labels, data) {

    var chart = currentChart;

    var line_chart = new Chart(chart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "black",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "black",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: data,
                spanGaps: false,
            }]
        }
    });
};

// pie chart

function showPieChart(json) {
    var poslygaData = [],
        koshtuData = [];

    for (var i = 0; i < json.length; i++) {
        poslygaData.push(json[i].послуга);
        koshtuData.push(json[i].кошти);
    }

    var letters = '0123456789ABCDEF';
    var colorStrBgc = "#";
    var colorStrHoverBgc = "#";
    var colorsArrBgc = [];
    var colorsArrHoverBgc = [];

    for (var i = 0; i < 49; i++) {
        for (var j = 0; j < 6; j++) {
            colorStrBgc += letters[Math.floor(Math.random() * 16)];
        }
        colorsArrBgc.push(colorStrBgc);
        colorStrBgc = "#";
    }
    for (var k = 0; k < 49; k++) {
        for (var m = 0; m < 6; m++) {
            colorStrHoverBgc += letters[Math.floor(Math.random() * 16)];
        }
        colorsArrHoverBgc.push(colorStrHoverBgc);
        colorStrHoverBgc = "#";
    }

    drawPieChart(poslygaData, koshtuData, colorsArrBgc, colorsArrHoverBgc);
}

function drawPieChart(labels, data, colorsBgc, colorHoverBgc) {
    var currentChart = $("#pie_chart");

    var pie_chart = new Chart(currentChart, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colorsBgc,
                hoverBackgroundColor: colorHoverBgc
            }]
        }
    });
}