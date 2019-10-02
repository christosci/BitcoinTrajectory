<?php include 'available_charts.php' ?>
<!DOCTYPE html> <meta charset="utf-8" />
<head>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-133348363-2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-133348363-2');
  </script>
  <title><?php echo $title; ?> - Bitcoin Trajectory</title>
  <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
  <link rel="stylesheet" href="../css/chart.css" />
  <link rel="stylesheet" href="../css/chartpage.css" />
  <meta 
     name='viewport' 
     content='width=device-width, initial-scale=0.7, user-scalable=0' 
  />
</head>
<body>
  <div id="chart-wrapper">
    <div id="chart"></div>
    <div id="bottom-chart"></div>
    <div id="bottom-bar">
      <div class="contents">
        <span class="website-name"><a href="/">BitcoinTrajectory.com</a></span>        
        <table class="settings-table">
          <tr>
            <td id="logScale" class="selected" <?php get_display_style('logScale'); ?>>
                Log<span class="tooltiptext">Toggle log scale</span>
            </td>
            <td id="halvings">
              Halvings<span class="tooltiptext">Toggle halving dates</span>
            </td>
            <td id="cycles">
              Cycles<span class="tooltiptext">Toggle bear/bull cycles</span>
            </td>
            <td id="cb" <?php get_display_style('cb'); ?>>
              95% CB<span class="tooltiptext">Toggle 95% confidence bands</span>
            </td>
            <td id="legend" class="selected">Legend</td>
          </tr>
        </table>
      </div>
    </div>
  </div>

  <script src="https://d3js.org/d3.v4.min.js"></script>
  <script src="../js/d3-xyzoom.min.js"></script>
  <script src="../js/d3-legend.js"></script>
  <script src="../js/helper.js"></script>
  <script src="../js/chart.js"></script>
  <script src="../js/bottom_chart.js"></script>
  <script src="<?php echo $chart_id; ?>.js"></script>
</body>
