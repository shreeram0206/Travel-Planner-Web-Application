function split_expenses(members, expenses) {
    // Create a matrix with zeros to store splits
    let splits = Array(members.length).fill().map(() => Array(members.length).fill(0))

    // Iterate through the expenses
    for (const expense of expenses) {
        // console.log(expense.amount)

        // Increment the share of the person who paid
        let paid_by_idx = members.indexOf(expense.paid_by)
        // splits[paid_by_idx][paid_by_idx] += expense.amount / expense.included_members.length

        // Increment the share of other people in the transaction
        for (const member of expense.included_members) {
            let member_idx = members.indexOf(member)
            if (member_idx != paid_by_idx) {
                splits[paid_by_idx][member_idx] += expense.amount / expense.included_members.length
            }
        }
    }


    let result = []

    // Process expenses
    for (let i = 0; i < members.length; i++) {
        for (let j = 0; j < members.length; j++) {
            if (i < j) {
                if (splits[i][j] > splits[j][i]) {
                    result.push([members[j], members[i], (splits[i][j] - splits[j][i]).toFixed(2)])
                }
                else if (splits[i][j] > splits[j][i]) {
                    result.push([members[i], members[j], (splits[j][i] - splits[i][j]).toFixed(2)])
                }
                else {}
            }
        }
    }
    return result
}


let trip = {
    destination: 'ChIJFU2bda4SM4cRKSCRyb6pOB8',
    admin_id: '112798998309830388171',
    members: [
        '112798998309830388171',
        '100359382889259565929',
        '100359382889259565928'
    ],
    expenses: [
        // Settled expense
        {
            title: 'Test Expense',
            amount: 10,
            paid_by: '112798998309830388171',
            included_members: [
                '100359382889259565929'
            ]
        },
        // Settled expense
        {
            title: 'Test Expense',
            amount: 10,
            paid_by: '112798998309830388171',
            included_members: [
                '112798998309830388171'
            ]
        },
        // 929 to pay 171 $5
        {
            title: 'Test Expense',
            amount: 10,
            paid_by: '112798998309830388171',
            included_members: [
                '112798998309830388171',
                '100359382889259565929'
            ]
        },
        // 171 to pay 929 $5
        {
            title: 'Test Expense',
            amount: 10,
            paid_by: '100359382889259565929',
            included_members: [
                '112798998309830388171',
                '100359382889259565929'
            ]
        },
        // 171 to pay 929 $10/3
        // 928 to pay 929 $10/3
        {
            title: 'Test Expense',
            amount: 10,
            paid_by: '100359382889259565929',
            included_members: [
                '112798998309830388171',
                '100359382889259565929',
                '100359382889259565928'
            ]
        }
    ]
}

console.log(split_expenses(trip.members, trip.expenses))


module.exports = {split_expenses}
