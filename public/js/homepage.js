import view from './view.js'
import BlockStreamer from './blockStreamer.js'

export default class extends view {
    count = 0;
    ids = [];
    miners = [];
    txss = [];
    dists = [];
    burns = [];
    constructor() {
        super()
        this.setTitle();
    }

    getHtml() {
        return `
        <div class="main-content-outer-box">
            <a href="#" class="site_logo"><img class="img-fluid"
                    src="https://i.postimg.cc/FF83HCvZ/breeze-logo.png"></a>
                    <div class="header-search-part">
                    <div class="hd-search-g-wrap">
                    <input id="input" class="input-design dblocks-search" onkeypress="searchEnter()" type="search"
                    placeholder="Block / Account / Tx" aria-label="Search">
                <button id="searchIcon" onclick="searchSubmit()">
                    
                </button>
                    </div>
                </div> <!-- ./header-search-part -->
            <div class="homepage_top">
                <div class="homepageTop_comp">
                    <p>Total Supply</p>
                    <p id="totalSupply" style="font-size:large;color:#1FC1C3"></p>
                    <div class="view-blk" onclick="window.location.href = '#/richlist'">
                        <p>View rich list</p>
                        <img src="icons/arrowRight.svg">
                    </div>
                </div>
                <div class="homepageTop_comp bdr-rg bdr-lf">
                    <p>Last block</p>
                    <p id="lastBlock" style="font-size: large;color:#1FC1C3"></p>
                    <div class="view-blk"><p>View all blocks</p><img src="icons/arrowRight.svg"></div>
                </div>
                <div class="homepageTop_comp">
                    <p>Total witness</p>
                    <p id="totalwitness" style="font-size: large;color:#1FC1C3"></p>
                    <div class="view-blk" onclick="window.location.href = '#/witness'"><p>View all witness</p><img src="icons/arrowRight.svg"></div>
                </div>
            </div>
            <div class="tbl-content-rw">
                <h3 class="tbl-title text-center"><span>Latest Blocks</span></h3>
                <div class="tbl-scroll-wrapper blocks_tab">
                    <div class="tbl-header">
                        <div class="tbl-th">Block</div>
                        <div class="tbl-th">Witness</div>
                        <div class="tbl-th">Transactions</div>
                        <div class="tbl-th">Time</div>
                    </div>
                    <div id="newblockslst" class="tbl-body"></div>
                </div>
            </div>
            <div class="tbl-content-rw">
                <h3 class="tbl-title text-center lt_trx"><span>Latest Transactions</span></h3>
                <div class="tbl-scroll-wrapper">
                    <div class="tb2-header">
                        <div class="tbl-th">Transaction ID</div>
                        <div class="tbl-th">Block</div>
                        <div class="tbl-th">Time</div>
                        <div class="tbl-th">Account</div>
                        <div class="tbl-th">Type</div>
                    </div>
                    <div id="largeblockslst" class="tbl-body"></div>
                </div>
            </div>
        </div>
        `
    }

    init() {
        // Load supply and reward pool, and update every 10 seconds
        //this.updateChainInfo()
        let blkStreamer = new BlockStreamer()
        blkStreamer.streamBlocks((newBlock) => {
            $('#newblockslst').prepend(this.newBlockCardHtml(newBlock));
            
            if (newBlock.txs.length> 0) {
                $('#largeblockslst').prepend(txCardsHtml(newBlock));
            }
                
        })
        intervals.push(setInterval(this.updateChainInfo, 10000));
        setInterval(() => { 
            if ($('#newblockslst').children().length > 10) { $('#newblockslst').children().last().remove() }
            if ($('#largeblockslst').children().length > 10) { $('#largeblockslst').children().last().remove() }
        }, 2500);
    }

    updateChainInfo() {
        // axios.get(config.api + '/supply').then((supplyRes) => {
        //     $('#supply-circulating').text(thousandSeperator(supplyRes.data.circulating / 100) + ' DTC')
        //     $('#supply-unclaimed').text(thousandSeperator(Math.ceil(supplyRes.data.unclaimed) / 100) + ' DTC')
        //     $('#supply-total').text(thousandSeperator(Math.ceil(supplyRes.data.total) / 100) + ' DTC')
        // })

        // axios.get(config.api + '/rewardPool').then((rpRes) => {
        //     $('#rp-theo').text(thousandSeperator(rpRes.data.theo / 100) + ' DTC')
        //     $('#rp-dist').text(thousandSeperator(Math.ceil(rpRes.data.dist) / 100) + ' DTC')
        //     $('#rp-avail').text(thousandSeperator(Math.ceil(rpRes.data.avail) / 100) + ' DTC')
        //     $('#rp-burn').text(thousandSeperator(Math.ceil(rpRes.data.burn) / 100) + ' DTC')
        //     $('#rp-votes').text(thousandSeperator(Math.ceil(rpRes.data.votes)) + ' VP')
        // })
    }

    newBlockCardHtml(block) {
        let blockCardHtml = '<div class="tbl-body-rw">'
        blockCardHtml += '<div class="tbl-td"><a class="p1" href="#/b/' + block._id + '">#' + block._id + '</a></div>'
        // blockCardHtml += '&nbsp;by&nbsp;'
        blockCardHtml += '<div class="tbl-td"><a class="p2" href="#/@' + block.miner + '">' + block.miner + '</a></div>'
        // blockCardHtml += '&nbsp;-&nbsp;'
        blockCardHtml += '<div class="tbl-td"><p class="p3">' + block.txs.length + '</p></div>'

        // if (isPuralArr(block.txs))
        //     blockCardHtml += ' tx(s), '
        // else
        //     blockCardHtml += ' tx, dist: '

        blockCardHtml += '<div class="tbl-td"><p id="blk-det-ts" class="p4"></p></div>'
        // blockCardHtml += ' DTC'

        if (block.burn) {
            // blockCardHtml += ', burned: '
            blockCardHtml += '<p id="blk-det-ts" class="p4"></p>'
            // blockCardHtml += ' DTC'
        }
        axios.get(config.api + '/block/' + block._id).then((blk) => {
            $('#blk-det-ts').text(new Date(blk.data.timestamp).toLocaleString())
        });
        axios.get(config.api + '/supply').then((supplyRes) => {
            $('#totalSupply').text(thousandSeperator(supplyRes.data.circulating / 1000000) + ' TMAC')
        })
        axios.get(config.api + '/rank/witnesses').then((witness) => {
            $('#totalwitness').text(witness.data.length)
        })
        $('#lastBlock').text(block._id)
        blockCardHtml += '</div>'
        this.count = this.count + 1;
        return blockCardHtml
    }

}