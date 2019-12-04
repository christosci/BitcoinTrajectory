<?php include ("header.html"); ?>
<div class="row odd">
  <div class="title w-100">Theoretical Value</div>
  <div class="container">
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="card">
        <a href="charts/chart.php?id=metcalfe" class="chart-link">
          <div class="card-body">
            <p class="card-title">Metcalfe's Law</p>
            <div id="thumbnail-metcalfe" class="thumbnail spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
        </a>
        <p class="card-text">
          Daily transactions (excluding the 100 most popular addresses)
          squared compared to market cap.<br />
          <a
            href="https://nakamotoinstitute.org/mempool/how-we-know-bitcoin-is-not-a-bubble/"
            >Learn More</a
          >
        </p>
      </div>
    </div>
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="card">
        <a href="charts/chart.php?id=generalized_metcalfe" class="chart-link">
          <div class="card-body">
            <p class="card-title">Generalized Metcalfe's Law</p>
            <div id="thumbnail-genmetcalfe" class="thumbnail spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
        </a>
        <p class="card-text">
          Number of active addresses compared to market cap using a
          generalized interpretation of Metcalfe's law.<br />
          <a href="https://arxiv.org/abs/1803.05663">Learn More</a>
        </p>
      </div>
    </div>
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="card">
        <a href="charts/chart.php?id=sf" class="chart-link">
          <div class="card-body">
            <p class="card-title">Stock to Flow</p>
            <div id="thumbnail-sf" class="thumbnail spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
        </a>
        <p class="card-text">
          SF = S / F, where S is the circulating supply and F is the yearly supply growth.<br />
          <a
            href="https://medium.com/@100trillionUSD/modeling-bitcoins-value-with-scarcity-91fa0fc03e25"
            >Learn More</a
          >
        </p>
      </div>
    </div>
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="card">
        <a href="charts/chart.php?id=mvrv" class="chart-link">
          <div class="card-body">
            <p class="card-title">Market Cap vs Realized Cap</p>
            <div id="thumbnail-mvrv" class="thumbnail spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
        </a>
        <p class="card-text">
          Realized cap is the summation of the product of UTXOs and the
          prices at which they last moved.<br />
          <a
            href="https://blog.goodaudience.com/bitcoin-market-value-to-realized-value-mvrv-ratio-3ebc914dbaee"
            >Learn More</a
          >
        </p>
      </div>
    </div>
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="card">
        <a href="charts/chart.php?id=metcalfe_multiple" class="chart-link">
          <div class="card-body">
            <p class="card-title">Metcalfe Multiple</p>
            <div id="thumbnail-metcalfemultiple" class="thumbnail spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
        </a>
        <p class="card-text">
          Price / Daily transactions (excluding the 100 most popular addresses)&sup2;
          <!-- <a
            href=""
            >Learn More</a
          > -->
        </p>
      </div>
    </div>
  </div>
</div>
<div class="row even">
  <div class="title w-100">Regression Analysis</div>
  <div class="container">
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="card">
        <a href="charts/chart.php?id=trolololo" class="chart-link">
          <div class="card-body">
            <p class="card-title">Logarithmic Regression</p>
            <div id="thumbnail-trolololo" class="thumbnail spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
        </a>
        <p class="card-text">
          Logarithmic regression of market price with x-intercept at the
          genesis block date.<br />
          <a href="https://bitcointalk.org/index.php?topic=831547.0"
            >Learn More</a
          >
        </p>
      </div>
    </div>
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="card">
        <a href="charts/chart.php?id=power_law" class="chart-link">
          <div class="card-body">
            <p class="card-title">Power Law</p>
            <div id="thumbnail-powerlaw" class="thumbnail spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
        </a>
        <p class="card-text">
          Log-log chart showing a power law relationship between price and days since the genesis block.<br />
          <a
            href="https://www.reddit.com/r/Bitcoin/comments/9cqi0k/bitcoin_power_law_over_10_year_period_all_the_way/"
            >Learn More</a
          >
        </p>
      </div>
    </div>
  </div>
</div>
<div class="row odd">
  <div class="title w-100">Sentiment</div>
  <div class="container">
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="card">
        <a href="charts/chart.php?id=interest" class="chart-link">
          <div class="card-body">
            <p class="card-title">Google Search Interest</p>
            <div id="thumbnail-interest" class="thumbnail spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
        </a>
        <p class="card-text">
          Price compared to monthly search interest for "Bitcoin."<br />
          <a href="https://scholar.smu.edu/cgi/viewcontent.cgi?article=1039&context=datasciencereview"
            >Learn More</a
          >
        </p>
      </div>
    </div>
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="card">
        <a href="charts/chart.php?id=fear_greed_index" class="chart-link">
          <div class="card-body">
            <p class="card-title">Fear and Greed Index</p>
            <div id="thumbnail-feargreed" class="thumbnail spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
        </a>
        <p class="card-text">
          alternative.me's fear and greed index compared to price.<br />
          <a href="https://alternative.me/crypto/fear-and-greed-index/"
            >Learn More</a
          >
        </p>
      </div>
    </div>
  </div>
</div>
<!-- <div class="row even">
  <div class="title w-100">Volatility</div>
  <div class="container">
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="card">
        <a href="charts/chart.php?id=daily_log_returns" class="chart-link">
          <div class="card-body">
            <p class="card-title">Log Returns</p>
            <div id="thumbnail-dailylogreturns" class="thumbnail spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
        </a>
        <p class="card-text">
          Logarithmic returns on a daily basis.<br />
          <a href="https://quantivity.wordpress.com/2011/02/21/why-log-returns/"
            >Learn More</a
          >
        </p>
      </div>
    </div>
  </div>
</div> -->
<?php include ("footer.html"); ?>

