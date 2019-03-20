<?php include ("header.html"); ?>
<div class="row odd">
  <div class="title w-100">Frequently Asked Questions</div>
  <div class="container">
    <div class="panel-group" id="accordion">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">What is BitcoinTrajectory.com?</a>
          </h4>
        </div>
        <div id="collapse1" class="panel-collapse collapse in">
          <div class="panel-body">
            <p>Ever since Bitcoin's inception over a decade ago, people have sought 
            to predict the future trajectory of its value using data and statistical visualizations.
            Many of these visualizations have been posted in websites, forums, and research papers at some point in time.
            However, given that Bitcoin's value is constantly changing in a highly volatile manner, these visualizations 
            quickly became obsolete once they stopped being maintained by their authors.</p>

            <p>BitcoinTrajectory.com seeks to solve this problem by providing a curated list of visualizations, all in one place, 
            all updated on a daily basis.</p>
          </div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">Do your statistical models hold any predictive power?</a>
          </h4>
        </div>
        <div id="collapse2" class="panel-collapse collapse">
          <div class="panel-body">
            <p>This is up to you to decide. If you have any questions during your quest for the Holy Grail of investing/trading, 
            you may contact the respective authors found under the "Learn More" links. Do not use these visualizations as a tool for speculation.
            Do your own research.</p>
          </div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" data-parent="#accordion" href="#collapse3">How often are the visualization updated?</a>
          </h4>
        </div>
        <div id="collapse3" class="panel-collapse collapse">
          <div class="panel-body">
            <p>Bitcoin network and market data are updated on a daily basis sometime around midnight UTC.</p>
            <p>In an effort to show their predictive power (or lack thereof), regression formulas and coefficients originally posted 
              somewhere else are never recalculated. In cases where regression coefficients have not been posted (such as Metcalfe's Law), 
              we have performed our own regression calculations on daily values from from Jul 17, 2010 to Feb 26, 2018 to ensure best fit.
            </p>
            <p>
              New visualizations are added on a regular basis, so be sure to check back every now and then.
            </p>
          </div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" data-parent="#accordion" href="#collapse4">Why do you not display coefficients of determination(R&sup2;) for any of your regression models?</a>
          </h4>
        </div>
        <div id="collapse4" class="panel-collapse collapse">
          <div class="panel-body">
            <p>
              While there are several nonlinear regression models out there that display R&sup2; values, those R&sup2; values are misleading and 
              should not be trusted. It is important to understand that R&sup2; is a goodness-of-fit measure for linear regressions only.</p>
            <p>
              In lieu of R&sup2;, some charts on this website display 95% confidence bands to help you judge the goodness-of-fit.
            </p>
          </div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" data-parent="#accordion" href="#collapse5">How can I support this project?</a>
          </h4>
        </div>
        <div id="collapse5" class="panel-collapse collapse">
          <div class="panel-body">
            <p>There are no ads on this website. This project is supported solely by donations from individuals like you.</p>
            <p>If you find the content on this website useful, please consider donating BTC to the address found at the bottom of the page. Thank you.</p>
          </div>
        </div>
      </div>
    </div> 
  </div>
</div>
<?php include ("footer.html"); ?>
