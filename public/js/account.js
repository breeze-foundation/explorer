import view from "./view.js";
import flairs from "./accountFlairs.js";

export default class extends view {
  constructor() {
    super();
    this.url = new URL(window.location.href);
    this.account = window.location.hash.split("/")[1].substr(1);
    this.accountlastupdate = 0;
    this.accountdata = null;
    this.accountnotfound = false;
    this.accountHistoryPage = parseInt(window.location.hash.split("/")[2]) || 1;
    this.witnessLastUpdate = 0;
    this.historyLoaded = false;
    this.setTitle("@" + this.account);
  }

  getHtml() {
    return `
            ${this.loadingHtml("acc", "account")}
            ${this.errorHtml("acc", "account")}
            ${this.notFoundHtml("acc", "Account")}
            <div id="acc-container">
            <div class="header-search-part mb-30">
                <div class="hd-search-g-wrap">
                    <input id="input" class="input-design dblocks-search" onkeypress="searchEnter()" type="search"
                        placeholder="Block / Account / Tx" aria-label="Search">
                    <button id="searchIcon" onclick="searchSubmit()">
        
                    </button>
                </div>
            </div>
            <!-- Left panel - Account details -->
            <div class="row">
                <div class="col-12 col-lg-4">
                    <div class="cmn-display">
                        <span class="btn btn-primary btn-block btn-acc" id="acc-name"></span>
                        <div class="display-tbl">
                            <table class="table table-sm" style="color: rgba(255, 255, 255, 0.5);">
                                <tr>
                                    <th scope="row">Balance</th>
                                    <td id="acc-meta-bal"></td>
                                </tr>
                                <tr>
                                    <th scope="row">Bandwidth</th>
                                    <td id="acc-meta-bw"></td>
                                </tr>
                                <tr>
                                    <th scope="row">Voting Power</th>
                                    <td id="acc-meta-vp"></td>
                                </tr>
                                <tr>
                                    <th scope="row">Subscribers</th>
                                    <td id="acc-meta-subs"></td>
                                </tr>
                                <tr>
                                    <th scope="row">Subscribed To</th>
                                    <td id="acc-meta-subbed"></td>
                                </tr>
                            </table>
                        </div>
                        <p id="acc-meta-created"></p>
                        <a type="button" target="_blank" class="btn btn-primary btn-block" id="acc-profile-dtube">View Profile
                            on
                            BeSocial</a>
                    </div>
                    <div class="cmn-display">
                        
                        <h4 class="cmn-display-title">Public Keys</h4>
                        <div class="accordion" id="acc-customkey">
                            <div class="card">
                                <div class="card-header" id="acc-masterkey-card">
                                    <button class="btn btn-link" type="button" data-toggle="collapse"
                                        data-target="#acc-masterkey-collapse" aria-expanded="true"
                                        aria-controls="acc-masterkey-collapse">Master</button>
                                </div>
                                <div id="acc-masterkey-collapse" class="collapse show" aria-labelledby="acc-masterkey-card"
                                    data-parent="#acc-customkey">
                                    <div class="card-body" id="acc-masterkey-det"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cmn-display">
                        <h4 class="cmn-display-title">Signature Thresholds</h4>
                        <div class="display-tbl">
                            <table class="table tbl-4 tbl-first-120 table-sm dblocks-acc-det-table">
                                <tbody id="acc-thresholds"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="cmn-display acc-witness">
                        <div id="acc-witness">
                            <h4 class="cmn-display-title">witness Details</h4>
                            <div class="display-tbl">
                                <table class="table tbl-4 tbl-first-120 table-sm dblocks-acc-det-table">
                                    <tbody>
                                        <tr>
                                            <th scope="row">Signing Key</th>
                                            <td id="acc-witness-key"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Peer</th>
                                            <td id="acc-witness-ws"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Last Block</th>
                                            <td id="acc-witness-lastblock"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Approval</th>
                                            <td id="acc-witness-appr"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Voters</th>
                                            <td id="acc-witness-voters"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Produced</th>
                                            <td id="acc-witness-produced"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Missed</th>
                                            <td id="acc-witness-miss"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Performance</th>
                                            <td id="acc-witness-performance"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Age</th>
                                            <td id="acc-witness-age"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="cmn-display witness-votes-block">
                        <h4 class="cmn-display-title">witness Votes</h4>
                        <div class="display-tbl">
                            <table class="table table-sm" id="acc-meta-approves"></table>
                        </div>
                    </div>
        
                    <div class="cmn-display profile_block">
                        <div id="acc-profile-metadata">
                            <h4 class="cmn-display-title">Metadata</h4>
                            <div id="acc-profile-json"></div>
                        </div>
                    </div>
                </div>
                <!-- Right panel - Account history -->
                <div class="col-12 col-lg" id="acc-history">
                    <h3 class="tbl-title margin-3 text-center"><span id="usr-trxz">User Transactions</span></h3>
                    <div id="acc-history-itms"></div>
                    <nav>
                        <ul class="pagination">
                            <li class="page-item" id="acc-history-page-prev"><a class="page-link" tabindex="-1">Previous</a>
                            </li>
                            <li class="page-item" id="acc-history-page-1"><a class="page-link">1</a></li>
                            <li class="page-item" id="acc-history-page-2"><a class="page-link">2</a></li>
                            <li class="page-item" id="acc-history-page-3"><a class="page-link">3</a></li>
                            <li class="page-item" id="acc-history-page-4"><a class="page-link">4</a></li>
                            <li class="page-item" id="acc-history-page-5"><a class="page-link">5</a></li>
                            <li class="page-item" id="acc-history-page-next"><a class="page-link">Next</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
        `;
  }

  init() {
    axios
      .get(config.api + "/account/" + this.account)
      .then((acc) => {
        this.accountdata = acc.data;
        this.accountlastupdate = new Date().getTime();

        // Fill account details
        $("#acc-name").text("@" + acc.data.name);
        $("#usr-trxz").text("Transactions by " + acc.data.name);
        $("#acc-masterkey-det").html(
          this.formatPubKeys({
            pub: acc.data.pub,
            types: [],
            weight: acc.data.pub_weight,
          })
        );
        $("#acc-customkey").append(this.customKeyHtml(acc.data.keys));
        $("#acc-profile-dtube").attr(
          "href",
          "https://besocial.ai/profile/" + acc.data.name
        );

        //if (flairs[this.account]) {$('#acc-name').html($('#acc-name').html() + ' <br><span class="badge badge-secondary">' + flairs[this.account] + '</span>')}

        let accCreatedStr = "Created by ";
        if (acc.data.created) {
          accCreatedStr += acc.data.created.by;
          accCreatedStr += " on ";
          accCreatedStr += new Date(acc.data.created.ts).toLocaleString();
        } else {
          //accCreatedStr += 'dtube on ' + new Date(1593350655283).toLocaleString() // timestamp of block #1 on testnet v2
        }
        $("#acc-meta-created").text(accCreatedStr);
        if (acc.data.json)
          $("#acc-profile-json").html(jsonToTableNRecursive(acc.data.json));
        else $(".profile_block").hide();

        this.updateAccount(acc.data);
        this.display();
        intervals.push(
          setInterval(
            () => this.reloadAccount((newacc) => this.updateAccount(newacc)),
            10000
          )
        );
      })
      .catch((e) => {
        $("#acc-loading").hide();
        $(".spinner-border").hide();
        if (e == "Error: Request failed with status code 404") {
          this.accountnotfound = true;
          $("#acc-notfound").show();
        } else $("#acc-error").show();
      });

    let accountHistoryUrl = config.api + "/history/" + this.account + "/0";
    if (isNaN(this.accountHistoryPage)) this.accountHistoryPage = 1;
    accountHistoryUrl += "/" + (this.accountHistoryPage - 1) * 50;

    axios.get(accountHistoryUrl).then((history) => {
      // Render account history cards
      $("#acc-history-itms").html(txACardsHtml(history.data));

      // Render account history pagination
      $("#acc-history-page-next a").attr(
        "href",
        "#/@" + this.account + "/" + (this.accountHistoryPage + 1)
      );
      if (this.accountHistoryPage == 1)
        $("#acc-history-page-prev").addClass("disabled");
      else
        $("#acc-history-page-prev a").attr(
          "href",
          "#/@" + this.account + "/" + (this.accountHistoryPage - 1)
        );
      if (this.accountHistoryPage >= 3) {
        $("#acc-history-page-3").addClass("active");
        for (let i = 0; i < 5; i++) {
          $("#acc-history-page-" + (i + 1) + " a").text(
            this.accountHistoryPage - 2 + i
          );
          $("#acc-history-page-" + (i + 1) + " a").attr(
            "href",
            "#/@" + this.account + "/" + (this.accountHistoryPage - 2 + i)
          );
        }
      } else {
        $("#acc-history-page-" + this.accountHistoryPage).addClass("active");
        for (let i = 0; i < 5; i++)
          $("#acc-history-page-" + (i + 1) + " a").attr(
            "href",
            "#/@" + this.account + "/" + (i + 1)
          );
      }

      if (history.data.length < 50) {
        $("#acc-history-page-next").addClass("disabled");
        if (this.accountHistoryPage < 3)
          for (let i = this.accountHistoryPage; i < 5; i++) {
            $("#acc-history-page-" + (i + 1)).hide();
          }
        else {
          $("#acc-history-page-4").hide();
          $("#acc-history-page-5").hide();
        }
      }

      this.historyLoaded = true;
      this.display();
    });
  }

  reloadAccount(cb) {
    if (new Date().getTime() - this.accountlastupdate < 60000)
      return cb(this.accountdata);
    axios
      .get(config.api + "/account/" + this.account)
      .then((acc) => {
        this.accountdata = acc.data;
        cb(acc.data);
      })
      .catch(() => cb(this.accountdata));
  }

  updateAccount(acc) {
    $("#acc-meta-bal").text(thousandSeperator(acc.balance / 1000000) + " TMAC");
    $("#acc-meta-bw").text(thousandSeperator(bandwidth(acc)) + " bytes");
    $("#acc-meta-vp").text(thousandSeperator(votingPower(acc)) + " VP");
    $("#acc-meta-subs").text(thousandSeperator(acc.followers.length));
    $("#acc-meta-subbed").text(thousandSeperator(acc.follows.length));
    if(acc.approves){$("#acc-meta-approves").html(this.witnessVotesHtml(acc.approves))}else{$('.witness-votes-block').hide()};
    $("#acc-thresholds").html(this.sigThresholdsTableHtml(acc.thresholds));

    if (acc.pub_witness) {
      this.updatewitnessestats();
      $("#acc-witness").show();
      $("#acc-witness-key").text(acc.pub_witness);
      $("#acc-witness-appr").text(
        thousandSeperator(acc.node_appr / 1000000) + " TMAC"
      );

      if (acc.json && acc.json.node && acc.json.node.ws)
        $("#acc-witness-ws").text(DOMPurify.sanitize(acc.json.node.ws));
      else $("#acc-witness-ws").text("N/A");
    }else{$(".acc-witness").hide();}
    addAnchorClickListener();
  }

  loadCurationApr(
    displayId = "",
    ts = 0,
    vp = 0,
    payout = 0,
    period = 2592000000
  ) {
    axios
      .get(config.api + "/votes/" + this.account + "/" + ts)
      .then((v) => {
        let i = 0;
        while (
          i < v.data.length &&
          v.data[i].ts > new Date().getTime() - period
        ) {
          // only count non-self votes
          if (v.data[i].author !== this.account) {
            vp += Math.abs(v.data[i].vp);
            payout += Math.floor(v.data[i].claimable);
          }
          i++;
        }
        let lastVote = v.data[v.data.length - 1];
        if (
          lastVote.ts < new Date().getTime() - period ||
          (lastVote.ts > ts && ts !== 0) ||
          v.data.length < 50
        )
          this.displayCurationApr(vp, payout, displayId);
        else this.loadCurationApr(displayId, lastVote.ts, vp, payout);
      })
      .catch(() => $("#" + displayId).text("Error"));
  }

  displayCurationApr(vp = 0, payout = 0, displayId = "") {
    //console.log('totals',vp,payout)
    if (vp === 0) $("#" + displayId).text("0%");
    else
      $("#" + displayId).text(
        thousandSeperator(Math.abs((payout * 365 * 24) / vp).toFixed(2)) + "%"
      );
  }

  display() {
    if (this.account && this.historyLoaded && !this.accountnotfound) {
      $("#acc-loading").hide();
      $(".spinner-border").hide();
      $("#acc-container").show();
      addAnchorClickListener();
    }
  }

  customKeyHtml(keys) {
    let result = "";
    for (let i = 0; i < keys.length; i++) {
      let sanitizedId = DOMPurify.sanitize(keys[i].id);
      result +=
        '<div class="card"><div class="card-header" id="acc-customkey-card-' +
        i +
        '">';
      result +=
        '<h5 class="mb-0"><button class="btn btn-link" type="button" data-toggle="collapse" data-target="#acc-customkey-collapse-' +
        i +
        '" aria-expanded="true" aria-controls="acc-customkey-collapse-' +
        i +
        '">' +
        sanitizedId +
        "</button></h5></div>";
      result +=
        '<div id="acc-customkey-collapse-' +
        i +
        '" class="collapse" aria-labelledby="acc-customkey-card-' +
        i +
        '" data-parent="#acc-customkey">';
      result +=
        '<div class="card-body">' +
        this.formatPubKeys(keys[i]) +
        "</div></div></div>";
    }
    return result;
  }

  formatPubKeys(key) {
    let result =
      "<strong>Public Key: </strong>" +
      key.pub +
      "<br><br><strong>Weight: </strong>" +
      (key.weight || 1) +
      "<br><br><strong>Permissions: </strong>";
    if (key.pub === "222222222222222222222222222222222222222222222")
      result += "NONE";
    else if (key.types.length == 0) result += "ALL";
    else {
      let typesStringArr = [];
      for (let i = 0; i < key.types.length; i++) {
        typesStringArr.push(TransactionTypes[key.types[i]]);
      }
      result += typesStringArr.join(", ");
    }
    return result;
  }

  sigThresholdsTableHtml(thresholds) {
    if (!thresholds) return '<tr><th scope="row">Default</th><td>1</td></tr>';

    let result = "";
    if (thresholds.default)
      result +=
        '<tr><th scope="row">Default</th><td>' +
        thresholds.default +
        "</td></tr>";
    else result += '<tr><th scope="row">Default</th><td>1</td></tr>';

    for (let t in thresholds)
      if (t !== "default")
        result +=
          '<tr><th scope="row"><span class="badge badge-pill badge-info">' +
          TransactionTypes[t] +
          "</span></th><td>" +
          thresholds[t] +
          "</td></tr>";
    return result;
  }

  witnessVotesHtml(approves) {
    let result = "";
    if (!approves) return "Not voting for witnesses";
    for (let i = 0; i < approves.length; i++)
      result +=
        '<tr><td><a href="#/@' +
        approves[i] +
        '">' +
        approves[i] +
        "</a></td></tr>";
    return result;
  }

  updatewitnessestats() {
    if (new Date().getTime() - this.witnessLastUpdate < 120000) return;
    axios
      .get(config.api + "/witness/" + this.account)
      .then((witness) => {
        this.witnessLastUpdate = new Date().getTime();
        $("#acc-witness-lastblock").text(thousandSeperator(witness.data.last));
        $("#acc-witness-voters").text(thousandSeperator(witness.data.voters));
        $("#acc-witness-produced").text(
          thousandSeperator(witness.data.produced)
        );
        $("#acc-witness-miss").text(thousandSeperator(witness.data.missed));
        $("#acc-witness-performance").text(
          witness.data.produced + witness.data.missed > 0
            ? Math.floor(
                (witness.data.produced /
                  (witness.data.produced + witness.data.missed)) *
                  100000
              ) /
                1000 +
                "%"
            : "N/A"
        );
        $("#acc-witness-age").text(
          witness.data.sinceTs
            ? thousandSeperator(sinceDays(witness.data.sinceTs).toFixed(2)) +
                " days"
            : "N/A"
        );
      })
      .catch(() => {});
  }
}
