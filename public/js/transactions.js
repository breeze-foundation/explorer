const TransactionTypes = {
    0: 'NEW_ACCOUNT',
    1: 'APPROVE_NODE_OWNER',
    2: 'DISAPPROVE_NODE_OWNER',
    3: 'TRANSFER',
    4: 'POST',
    5: 'VOTE',
    6: 'USER_JSON',
    7: 'FOLLOW',
    8: 'UNFOLLOW',
    10: 'NEW_KEY',
    11: 'REMOVE_KEY',
    12: 'CHANGE_PASSWORD',
    13: 'PROMOTED_COMMENT',
    14: 'TRANSFER_VP',
    15: 'TRANSFER_BW',
    16: 'LIMIT_VP',
    18: 'ENABLE_NODE',
    20: 'NEW_WEIGHTED_KEY',
    21: 'SET_SIG_THRESHOLD',
    22: 'SET_PASSWORD_WEIGHT',
    23: 'BRIDGE_DEPOSIT',
    24: 'BRIDGE_UPDATE_TX',
    25: 'BRIDGE_WITHDRAW',
    26: 'CATEGORY_FOLLOW',
    27: 'CATEGORY_UNFOLLOW',
    28: 'SET_LAST_READ'
}

function txCardsHtml(blocks) {
    let result = ''
    if (blocks.length === undefined) {
        result += getOneRowHtml(blocks)
    } else {
        for (let i = 0; i < blocks.length; i++) {
            result += getOneRowHtml(blocks[i]);
        }
    }

    return result
}

function txACardsHtml(blocks) {
    let result = ''
    for (let i = 0; i < blocks.length; i++)
        for (let j = 0; j < blocks[i].txs.length; j++) {
            result += '<div class="card dblocks-card"><p class="dblocks-card-content">' + DOMPurify.sanitize(txToHtml(blocks[i].txs[j]))
            result += ' <a href="#/tx/' + blocks[i].txs[j].hash + '" class="badge badge-pill badge-secondary">'
            result += '<a class="p2" href="#/tx/' + blocks[i].txs[j].hash + '" style="color: rgb(248 246 246 / 70%);">[' + getUserAddress(blocks[i].txs[j].hash) + ']</a>'
            result += '</a></p></div>'
        }
    return result
}
function getOneRowHtml(one) {
    let result = ''
    for (let j = 0; j < one.txs.length; j++) {
        //result += '<div class="card dblocks-card"><p class="dblocks-card-content">' + DOMPurify.sanitize(txToHtml(one.txs[j]))
        //result += ' <a href="#/tx/' + one.txs[j].hash + '" class="badge badge-pill badge-secondary">'
        //result += one.txs[j].hash.substr(0,6)
        //result += '</a></p></div>'
        axios.get(config.api + '/tx/' + one.txs[j].hash).then((blk) => {
            $('#blk-det-tsm').text(new Date(blk.data.ts).toLocaleString())
            $('#blk-det-id').text("#" + blk.data.includedInBlock).attr("href", "#/b/" + blk.data.includedInBlock)
            $('#blk-det-usr').text(blk.data.sender).attr("href", "#/@" + blk.data.sender)
        });
        result = '<div class="tb2-body-rw">'
        result += '<div class="tbl-td"><a class="p2" href="#/tx/' + one.txs[j].hash + '">' + getUserAddress(one.txs[j].hash) + '</a></div>'
        result += '<div class="tbl-td"><a id="blk-det-id" href="" class="p1"></a></div>'
        result += '<div class="tbl-td"><p id="blk-det-tsm" class="p3"></p></div>'
        result += '<div class="tbl-td"><a id="blk-det-usr" href="" class="p3"></a></div>'
        result += '<div class="tbl-td"><p class="p4">' + ntxToHtml(one.txs[j]) + '</p></div>'
        
        result += '</div>'
    }
    return result
}


function getNewRowHtml(one) {
    let result = ''
    for (let j = 0; j < one.txs.length; j++) {
        result += '<div class="card dblocks-card"><p class="dblocks-card-content">' + DOMPurify.sanitize(txToHtml(one.txs[j]))
        result += ' <a href="#/tx/' + one.txs[j].hash + '" class="badge badge-pill badge-secondary">'
        result += one.txs[j].hash.substr(0,6)
        result += '</a></p></div>'
    }
    return result
}

function ntxToHtml(tx) {
switch (tx.type) {
        case 0:
            return 'New Account'
        case 1:
            return 'Approved Witness'
        case 2:
            return 'UnApproved Witness'
        case 3:
            return 'Transfer'
        case 4:
            return 'New Post'
        case 5:
            return 'UpVoted'
        case 6:
            return 'Profile Updated'
        case 7:
            return 'Following User'
        case 8:
            return 'UnFollowing user'
        case 10:
            return 'New Custom key'
        case 11:
            return 'Removed Custom Key'
        case 12:
            return 'Changed Master Key'
        case 13:
            return 'Boost Post'
        case 14:
            return 'VP Transfer'
        case 15:
            return 'BW Transfer'
        case 16:
            return 'VP Limit'
        case 18:
            return 'Witness key Updated'
        case 20:
            return 'New Custom key (id + weight)'
        case 21:
            return 'Set Signature Thresholds'
        case 22:
            return 'Set Master key weight'
        case 23:
            return 'Withdraw'
        case 24:
            return 'Withdrawal Updated'
        case 25:
            return 'Tokens deposit'
        case 26:
            return 'Category Subscribed'
        case 27:
            return 'Category unSubscribed'
        case 28:
            return 'Checked Notifications'
        default:
            return 'Unknown transaction ' + tx.type
    }
}
function txToHtml(tx) {
    let result = aUser(tx.sender)
    switch (tx.type) {
        case 0:
            return result + ' created new account ' + aUser(tx.data.name)
        case 1:
            return result + ' approved witness ' + aUser(tx.data.target)
        case 2:
            return result + ' disapproved witness ' + aUser(tx.data.target)
        case 3:
            result = result + ' transferred ' + tx.data.amount / 1000000 + ' TMAC to ' + aUser(tx.data.receiver)
            if (tx.data.memo)
                result += ', memo: ' + tx.data.memo
            return result
        case 4:
            return result + ' shared new post ' + aContent(tx.sender + '/' + tx.data.link)
        case 5:
            return result + ' upvoted ' + aContent(tx.data.author + '/' + tx.data.link)
        case 6:
            return result + ' update profile'
        case 7:
            return result + ' followed ' + aUser(tx.data.target)
        case 8:
            return result + ' unfollowed ' + aUser(tx.data.target)
        case 10:
            return result + ' created a custom key with id ' + tx.data.id
        case 11:
            return result + ' removed a custom key with id ' + tx.data.id
        case 12:
            return result + ' changed the master key'
        case 13:
            return result + ' boost the link ' + aContent(tx.sender + '/' + tx.data.link) + ' by burning ' + (tx.data.burn / 1000000) + ' TOK '
        case 14:
            return result + ' transferred ' + tx.data.amount + ' VP to ' + aUser(tx.data.receiver)
        case 15:
            return result + ' transferred ' + tx.data.amount + ' bytes to ' + aUser(tx.data.receiver)
        case 16:
            return result + ' set a limit on account voting power to ' + tx.data.amount + ' VP'
        case 18:
            return result + ' updated witness key for block production'
        case 20:
            return result + ' created a custom key with id ' + tx.data.id + ' and weight ' + tx.data.weight
        case 21:
            return result + ' set signature thresholds'
        case 22:
            return result + ' set master key weight to ' + tx.data.weight
        case 23:
            return result + ' initiated withdrawal'
        case 24:
            return result + ' withdrawal status updated'
        case 25:
            return result + ' tokens deposit initiated'
        case 26:
            return result + ' subscribed to category'
        case 27:
            return result + ' unsubscribed to category'
        case 28:
            return result + ' checked notifications'
        default:
            return 'Unknown transaction type ' + tx.type
    }
}

function aUser(user) {
    return '<a href="#/@'+user+'">'+user+'</a>'
}

function aContent(content) {
    return '<a href="#/content/'+content+'">@'+content+'</a>'
}

function getUserAddress(userAddress) {
    let firstFive = userAddress.substring(0, 6);
    let lastFive = userAddress.substr(userAddress.length - 7);
    return firstFive + '...' + lastFive;
}