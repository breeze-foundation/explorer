import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Richlist')
        this.rankLoaded = false
        this.distLoaded = false
        this.errored = false
    }

    getHtml() {
        return `
            ${this.loadingHtml('richlist', 'richlist')}
            ${this.errorHtml('richlist', 'richlist')}
            <div id="richlist-container">
            <div class="with-subtitle">
                <h3 class="tbl-title text-center"><span>Richlist</span></h3>
                <p class="text-center" style="color:#f8f8f8">Wealth distribution of accounts with non-zero balance</p>
            </div>
            <div class="display-tbl style-one mb-30">
                <table class="table table-sm table-striped" id="distribution-table">
                    <thead>
                        <tr>
                            <th scope="col">Range (TMAC)</th>
                            <th scope="col">Total Accounts</th>
                            <th scope="col">% accounts</th>
                            <th scope="col">Total Balances</th>
                            <th scope="col">% balances</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="distribution-0">
                            <th scope="row">[0.01 - 0.1)</th>
                        </tr>
                        <tr id="distribution-1">
                            <th scope="row">[0.1 - 1)</th>
                        </tr>
                        <tr id="distribution-2">
                            <th scope="row">[1 - 10)</th>
                        </tr>
                        <tr id="distribution-3">
                            <th scope="row">[10 - 100)</th>
                        </tr>
                        <tr id="distribution-4">
                            <th scope="row">[100 - 1,000)</th>
                        </tr>
                        <tr id="distribution-5">
                            <th scope="row">[1,000 - 10,000)</th>
                        </tr>
                        <tr id="distribution-6">
                            <th scope="row">[10,000 - 100,000)</th>
                        </tr>
                        <tr id="distribution-7">
                            <th scope="row">[100,000 - 1,000,000)</th>
                        </tr>
                        <tr id="distribution-8">
                            <th scope="row">[1,000,000 - ∞)</th>
                        </tr>
                        <tr id="distribution-total">
                            <th scope="row">Total</th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3 class="tbl-title text-center"><span>Top 100 accounts sorted by balance</span></h3>
            <div class="display-tbl style-one">
                <table class="table table-sm table-striped" id="richlist-table">
                    <thead>
                        <tr>
                            <th scope="col">Position</th>
                            <th scope="col">Account</th>
                            <th scope="col">Balance</th>
                            <th scope="col">Subscribers</th>
                            <th scope="col">Subscribed</th>
                        </tr>
                    </thead>
                    <tbody>
        
                    </tbody>
                </table>
            </div>
        </div>
        `
    }

    init() {
        axios.get(config.api + '/rank/balance').then((richlist) => {
            let htmlresult = ''
            for (let i = 0; i < richlist.data.length; i++) {
                htmlresult += '<tr><th scope="row">' + (i + 1) + '</th>'
                htmlresult += '<td><a href="#/@'+richlist.data[i].name+'" style="font-size:12px;font-weight:normal;">' + richlist.data[i].name + '</a></td>'
                htmlresult += '<td>' + thousandSeperator((richlist.data[i].balance / 1000000).toFixed(6)) + ' TMAC</td>'
                htmlresult += '<td>' + richlist.data[i].subs + '</td>'
                htmlresult += '<td>' + richlist.data[i].subbed + '</td></tr>'
            }
            $('#richlist-table tbody').append(htmlresult)
            this.rankLoaded = true
            this.display()
        }).catch(() => {
            this.errored = true
            this.display()
        })
        axios.get(config.api + '/distribution').then((dist) => {
            console.log(dist.data)
            let totalBalance = 0
            let totalAccounts = 0
            let totals = dist.data; let ntotal = totals.filter(Boolean);
            console.log(ntotal)
            // first loop to tally up total balance and accounts
            for (let i = 0; i < ntotal.length; i++) {
                totalBalance += ntotal[i].sum;
                totalAccounts += ntotal[i].count
            }

            // second loop to display them
            for (let i = 0; i < ntotal.length; i++)
                $('#distribution-' + i).append('<td>' + thousandSeperator(ntotal[i].count) + '</td><td>' + roundDec(ntotal[i].count / totalAccounts * 100, 2) + '%</td><td>' + thousandSeperator(ntotal[i].sum / 100) + ' TMAC</td><td>' + roundDec(ntotal[i].sum / totalBalance * 100, 2) + '%</td>')
            $('#distribution-total').append('<td><strong>' + thousandSeperator(totalAccounts) + '</strong></td><td><strong>100%</strong></td><td><strong>' + thousandSeperator(totalBalance / 100) + ' TMAC</strong></td><td><strong>100%</strong></td>')

            this.distLoaded = true
            this.display()
        })
    }

    display() {
        if (!this.errored && this.rankLoaded && this.distLoaded) {
            $('#richlist-loading').hide()
            $('.spinner-border').hide()
            $('#richlist-container').show()
        } else if (this.errored) {
            $('#richlist-loading').hide()
            $('.spinner-border').hide()
            $('#richlist-error').show()
        }
    }
}
