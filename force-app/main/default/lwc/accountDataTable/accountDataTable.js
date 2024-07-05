import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import getAccountswithSearch from '@salesforce/apex/AccountController.getAccountswithSearch';
import { NavigationMixin } from 'lightning/navigation';

const COLUMNS = [
    {
        label: 'Name',
        fieldName: 'accountUrl',
        type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'Name'
            },
            target: '_blank'
        },
        sortable: true
    },
    { label: 'Account Owner', fieldName: 'OwnerName', sortable: true },
    { label: 'Phone', fieldName: 'Phone', sortable: true ,editable: true  },
    { label: 'Website', fieldName: 'Website', type: 'url', sortable: false , editable: true  },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', sortable: false , editable: true }
   
];

export default class AccountDataTable extends LightningElement {
    @track accounts;
    @track columns = COLUMNS;
    @track sortedBy;
    @track sortedDirection;
    searchKey = '';

    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            alert('inside wire');
            this.accounts = data.map(record => {
               // alert('url' + '/lightning/r/Account/'+ record.Id + '/view');
                return { ...record, OwnerName: record.Owner.Name, 
                accountUrl: '/lightning/r/Account/'+ record.Id + '/view'};
            });
        } else if (error) {
            this.accounts = undefined;
            console.error('Error:', error);
        }
    }
 
       handleSearch(event) {
       this.searchKey = event.target.value;
        getAccountswithSearch({ searchKey: this.searchKey })
            .then(result => {
                this.accounts = result.map(record => {
                    return { ...record, OwnerName: record.Owner.Name, 
                     accountUrl: '/lightning/r/Account/'+ record.Id + '/view'};
                });
            })
            .catch(error => {
                this.accounts = undefined;
                console.error('Error:', error);
            });
    }


    handleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        this.sortedBy = sortedBy;
        this.sortedDirection = sortDirection;
        this.sortData(sortedBy, sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.accounts));
        let keyValue = (a) => {
            return a[fieldname] ? a[fieldname].toLowerCase() : '';
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x, y) => {
            x = keyValue(x);
            y = keyValue(y);
            return isReverse * ((x > y) - (y > x));
        });
        this.accounts = parseData;
    }

    handleRowAction(event) {
        alert('inside');
        const row = event.detail.row;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }
}