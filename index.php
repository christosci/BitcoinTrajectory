<?php include ("header.html"); ?>
<div class="row odd">
  <div class="title w-100">Theoretical Value</div>
  <div class="container">
    <div class="col-md-3 col-sm-4 col-xs-12">
      <div class="card">
        <a href="charts/metcalfe.html" class="chart-link">
          <div class="card-body">
            <p class="card-title">Metcalfe's Law</p>
            <div id="thumbnail-1" class="thumbnail spinner">
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
    <div class="col-md-3 col-sm-4 col-xs-12">
      <div class="card">
        <a href="charts/generalized_metcalfe.html" class="chart-link">
          <div class="card-body">
            <p class="card-title">Generalized Metcalfe's Law</p>
            <div id="thumbnail-2" class="thumbnail spinner">
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
    <div class="col-md-3 col-sm-4 col-xs-12">
      <div class="card">
        <a href="charts/m2.html" class="chart-link">
          <div class="card-body">
            <p class="card-title">M2 vs Market Price</p>
            <div id="thumbnail-3" class="thumbnail spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
        </a>
        <p class="card-text">
          The M2 formula is given by 100(N<sup>1.5</sup>/S), where N is
          the number of transactions and S is the current supply.<br />
          <a
            href="https://medium.com/@clearblocks/valuing-bitcoin-and-ethereum-with-metcalfes-law-aaa743f469f6"
            >Learn More</a
          >
        </p>
      </div>
    </div>
    <div class="col-md-3 col-sm-4 col-xs-12">
      <div class="card">
        <a href="charts/mvrv.html" class="chart-link">
          <div class="card-body">
            <p class="card-title">Market Cap vs Realized Cap</p>
            <div id="thumbnail-4" class="thumbnail spinner">
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
  </div>
</div>
<div class="row even">
  <div class="title w-100">Regression Analysis</div>
  <div class="container">
    <div class="col-md-3 col-sm-4 col-xs-12">
      <div class="card">
        <a href="charts/trolololo.html" class="chart-link">
          <div class="card-body">
            <p class="card-title">Logarithmic Regression</p>
            <div id="thumbnail-5" class="thumbnail spinner">
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
          genesis block date. Regression coefficients were obtained from
          BitcoinTalk.org forum user Trolololo.<br />
          <a href="https://bitcointalk.org/index.php?topic=831547.0"
            >Learn More</a
          >
        </p>
      </div>
    </div>
    <div class="col-md-3 col-sm-4 col-xs-12">
      <div class="card">
        <a href="charts/power_law.html" class="chart-link">
          <div class="card-body">
            <p class="card-title">Power Law</p>
            <div id="thumbnail-6" class="thumbnail spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
        </a>
        <p class="card-text">
          Log-log chart showing a power law relationship between price and time since the genesis block.<br />
          <a
            href="https://www.reddit.com/r/Bitcoin/comments/9cqi0k/bitcoin_power_law_over_10_year_period_all_the_way/"
            >Learn More</a
          >
        </p>
      </div>
    </div>
  </div>
</div>
<?php include ("footer.html"); ?>

