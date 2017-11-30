class FeatureListCtrl {
    constructor($http, $q, $localStorage, FeatureService, AccountService) {
        'ngInject';

        this._FeatureService = FeatureService;
        this.$localStorage = $localStorage;

        this.features = this._FeatureService.all;

        this.features.$loaded().then(features => {
            angular.forEach(features, function(feature) {
                feature.accountsMeta = [];
                feature.totalValue = 0;
                angular.forEach(feature.accounts, function(account) {
                    AccountService.getAccount(account.accountKey).then(
                        account => {
                            feature.accountsMeta.push(account);
                            feature.totalValue += parseInt(account.value);
                        }
                    );
                });
            });
        });

        this.columns = {
            status: {
                id: 'status',
                display: true,
                displayName: 'Status'
            },
            labels: {
                id: 'labels',
                display: true,
                displayName: 'Labels'
            },
            summary: {
                id: 'subject',
                display: true,
                displayName: 'Summary'
            },
            originalRequester: {
                id: 'accountsMeta[0].name',
                display: true,
                displayName: 'Original Requester'
            },
            date: {
                id: 'dateCreated',
                display: true,
                displayName: 'Date'
            },
            totalValue: {
                id: 'totalValue',
                display: true,
                displayName: 'Total Value',
                thAlign: 'text-right'
            }
        };
    }

    $onInit() {
        // set default
        if (typeof this.getTablePrefs() === 'undefined') {
            this.tablePrefs = {
                type: 'dateCreated',
                reverse: true
            };
            // grab from local storage
        } else {
            this.tablePrefs = {
                type: this.getTablePrefs().type,
                reverse: this.getTablePrefs().reverse
            };
        }
        this.searchFeatures = '';

        // this.tableWidth = this.getTablePrefs().width || 'container';
    }

    sortColumnType(col, reverse) {
        this.tablePrefs.reverse = false;
        if (this.tablePrefs.type == col) {
            this.tablePrefs.reverse = !reverse;
        } else {
            this.tablePrefs.reverse = false;
            this.tablePrefs.type = col;
        }
        this.setTablePrefs(this.tablePrefs);
    }

    setTablePrefs(prefs) {
        this.$localStorage.tablePrefsSaved = prefs;
    }

    getTablePrefs() {
        return this.$localStorage.tablePrefsSaved;
    }
}

export default FeatureListCtrl;
