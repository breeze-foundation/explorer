import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('witness')
    }

    getHtml() {
        return `
            <div class="d-flex justify-content-center" id="witness-loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading witness...</span>
                </div>
            </div>
            <div id="witness-error">
                <h2>Something went wrong when retrieving witness</h2><br>
                <a type="button" class="btn btn-primary" href="#">Home</a>
            </div>
            <div id="witness-container">
            <div class="with-subtitle">
            <h3 class="tbl-title text-center"><span>Witnesses</span></h3>
                <p class="text-center" style="color:#f8f8f8">List of top ranked breeze blockchain witnesses by approval value.</p>
            </div>
                <div class="display-tbl style-one">
                <table class="" id="witness-table">
                <thead><tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Account</th>
                    <th scope="col">Balance</th>
                    <th scope="col">Approval</th>
                    <th scope="col">Voters</th>
                    <th scope="col">Produced</th>
                    <th scope="col">Missed</th>
                </tr></thead>
                <tbody></tbody>
            </table>
                </div>
            </div>
        `
    }

    init() {
        axios.get(config.api + '/rank/witnesses').then((witness) => {
            let htmlresult = ''
            for (let i = 0; i < witness.data.length; i++) {
                console.log(witness.data[i].balance)
                htmlresult += '<tr><th scope="row">' + (i + 1) + '</th>'
                htmlresult += '<td><a href="#/@'+witness.data[i].name+'" style="font-size:12px;font-weight:normal;">' + witness.data[i].name + '</a></td>'
                htmlresult += '<td>' + numFormatter((witness.data[i].balance / 1000000).toFixed(3)) + ' TMAC</td>'
                htmlresult += '<td>' + numFormatter((witness.data[i].node_appr / 1000000).toFixed(3)) + ' TMAC</td>'
                htmlresult += '<td>' + thousandSeperator(witness.data[i].voters) + '</td>'
                htmlresult += '<td>' + thousandSeperator(witness.data[i].produced) + '</td>'
                htmlresult += '<td>' + thousandSeperator(witness.data[i].missed) + '</td>'
                htmlresult += '</tr>'
            }
            $('#witness-table tbody').append(htmlresult)
            $('#witness-loading').hide()
            $('.spinner-border').hide()
            $('#witness-container').show()
        }).catch(() => {
            $('#witness-loading').hide()
            $('.spinner-border').hide()
            $('#witness-error').show()
        })
    }
}
function numFormatter(num) {
    if (num > 999 && num < 1000000) {
        return parseFloat((num / 1000).toFixed(1)) + 'K';
    } else if (num > 1000000) {
        return parseFloat((num / 1000000).toFixed(1)) + 'M';
    } else if (num < 900) { return num; }
}