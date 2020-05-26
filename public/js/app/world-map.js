/**
 * The following code is inspired/copied from https://www.amcharts.com/demos/rotating-globe-with-circles/
 * @param data the list of players by country
 */
function createMap(data) {
  am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    var chart = am4core.create("chart-div", am4maps.MapChart);
    var interfaceColors = new am4core.InterfaceColorSet();

    try {
      chart.geodata = am4geodata_worldLow;
    } catch (e) {
      chart.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
    }

    var label = chart.createChild(am4core.Label);
    label.text = "Players currently online by country";
    label.fontSize = 12;
    label.align = "left";
    label.valign = "bottom";
    label.fill = am4core.color("#927459");
    label.background = new am4core.RoundedRectangle();
    label.background.cornerRadius(10, 10, 10, 10);
    label.padding(10, 10, 10, 10);
    label.marginLeft = 30;
    label.marginBottom = 30;
    label.background.strokeOpacity = 0.3;
    label.background.stroke = am4core.color("#927459");
    label.background.fill = am4core.color("#f9e3ce");
    label.background.fillOpacity = 0.6;

    var dataSource = chart.createChild(am4core.TextLink);
    dataSource.text = "Data source: FAF lobby server";
    dataSource.fontSize = 12;
    dataSource.align = "left";
    dataSource.valign = "top";
    dataSource.fill = am4core.color("#927459");
    dataSource.padding(10, 10, 10, 10);
    dataSource.marginLeft = 30;
    dataSource.marginTop = 30;

    // Set projection
    chart.projection = new am4maps.projections.Orthographic();
    chart.panBehavior = "rotateLongLat";
    chart.padding(20, 20, 20, 20);

    // Add zoom control
    chart.zoomControl = new am4maps.ZoomControl();

    var homeButton = new am4core.Button();
    homeButton.events.on("hit", function () {
      chart.goHome();
    });

    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    homeButton.marginBottom = 10;
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);

    chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#bfa58d");
    chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;
    chart.deltaLongitude = 20;
    chart.deltaLatitude = -20;

    // limits vertical rotation
    chart.adapter.add("deltaLatitude", function (delatLatitude) {
      return am4core.math.fitToRange(delatLatitude, -90, 90);
    });

    // Create map polygon series

    var shadowPolygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    shadowPolygonSeries.geodata = am4geodata_continentsLow;

    try {
      shadowPolygonSeries.geodata = am4geodata_continentsLow;
    } catch (e) {
      shadowPolygonSeries.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
    }

    shadowPolygonSeries.useGeodata = true;
    shadowPolygonSeries.dx = 2;
    shadowPolygonSeries.dy = 2;
    shadowPolygonSeries.mapPolygons.template.fill = am4core.color("#000");
    shadowPolygonSeries.mapPolygons.template.fillOpacity = 0.2;
    shadowPolygonSeries.mapPolygons.template.strokeOpacity = 0;
    shadowPolygonSeries.fillOpacity = 0.1;
    shadowPolygonSeries.fill = am4core.color("#000");


    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    polygonSeries.calculateVisualCenter = true;
    polygonSeries.tooltip.background.fillOpacity = 0.2;
    polygonSeries.tooltip.background.cornerRadius = 20;

    var template = polygonSeries.mapPolygons.template;
    template.nonScalingStroke = true;
    template.fill = am4core.color("#f9e3ce");
    template.stroke = am4core.color("#e2c9b0");

    polygonSeries.calculateVisualCenter = true;
    template.propertyFields.id = "id";
    template.tooltipPosition = "fixed";
    template.fillOpacity = 1;

    template.events.on("over", function (event) {
      if (event.target.dummyData) {
        event.target.dummyData.isHover = true;
      }
    });
    template.events.on("out", function (event) {
      if (event.target.dummyData) {
        event.target.dummyData.isHover = false;
      }
    });

    var hs = polygonSeries.mapPolygons.template.states.create("hover");
    hs.properties.fillOpacity = 1;
    hs.properties.fill = am4core.color("#deb7ad");


    var graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
    graticuleSeries.mapLines.template.stroke = am4core.color("#fff");
    graticuleSeries.fitExtent = false;
    graticuleSeries.mapLines.template.strokeOpacity = 0.2;
    graticuleSeries.mapLines.template.stroke = am4core.color("#fff");


    var measelsSeries = chart.series.push(new am4maps.MapPolygonSeries());
    measelsSeries.tooltip.background.fillOpacity = 0;
    measelsSeries.tooltip.background.cornerRadius = 20;
    measelsSeries.tooltip.autoTextColor = false;
    measelsSeries.tooltip.label.fill = am4core.color("#000");
    measelsSeries.tooltip.dy = -5;

    var measelTemplate = measelsSeries.mapPolygons.template;
    measelTemplate.fill = am4core.color("#bf7569");
    measelTemplate.strokeOpacity = 0;
    measelTemplate.fillOpacity = 0.75;
    measelTemplate.tooltipPosition = "fixed";


    var hs2 = measelsSeries.mapPolygons.template.states.create("hover");
    hs2.properties.fillOpacity = 1;
    hs2.properties.fill = am4core.color("#86240c");

    polygonSeries.events.on("inited", function () {
      polygonSeries.mapPolygons.each(function (mapPolygon) {
        var count = data[mapPolygon.id];

        if (count > 0) {
          var polygon = measelsSeries.mapPolygons.create();
          polygon.multiPolygon = am4maps.getCircle(mapPolygon.visualLongitude, mapPolygon.visualLatitude, Math.max(0.2, Math.log(count) * Math.LN10 / 10));
          polygon.tooltipText = mapPolygon.dataItem.dataContext.name + ": " + count;
          mapPolygon.dummyData = polygon;
          polygon.events.on("over", function () {
            mapPolygon.isHover = true;
          });
          polygon.events.on("out", function () {
            mapPolygon.isHover = false;
          });
        } else {
          mapPolygon.tooltipText = mapPolygon.dataItem.dataContext.name + ": 0";
          mapPolygon.fillOpacity = 0.9;
        }
      });
    });
  });
}

window.addEventListener("load", () => {
  $.get("lobby_api", {resource: "countries"}, function (data) {
    createMap(data);
  }, "json");
});
