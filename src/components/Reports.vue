<template>
    <div>
        <div class="new-todo">
        </div>

        <el-table :data="activities"
                  v-loading="loading"
                  :default-sort = "{prop: 'date', order: 'descending'}"
                  class="report-list">
            <el-table-column label="Todo" sortable prop="todo_title">
            </el-table-column>
            <el-table-column label="Date" prop="date" sortable :formatter="dateFormatter" :filters="reportsDates" :filter-method="filterHandler">
            </el-table-column>
            <el-table-column label="Minutes" sortable prop="minutes">
            </el-table-column>
            <el-table-column
                    align="right">
                <template slot="header">
                    <el-popconfirm
                            confirmButtonText='OK'
                            cancelButtonText='No, Thanks'
                            icon="el-icon-info"
                            iconColor="red"
                            title="Are you sure to delete this?"
                            @onConfirm="deleteOldReports">
                        <el-button slot="reference" type="danger" size="small" icon="el-icon-delete">Delete old done
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from "vuex";

    export default {
        name: "Reports",

        beforeMount() {
            this.$store.dispatch('day_activities/retrieveActivities')
        },

        computed: {
            reportsDates() {
                let output = [];
                let allDates = this.activities.map(a => a.date.withoutTime());

                allDates = allDates.filter((date, i, self) =>
                    self.findIndex(d => d.getTime() === date.getTime()) === i
                )

                allDates.forEach(d => {
                    output.push({text: d.toLocaleDateString(), value: d.getTime()})
                })

                return output;
            },
            ...mapState({
                loading: state => state.day_activities.actLoading
            }),
            ...mapGetters('day_activities', {
                activities: 'activitiesWithTitle'
            })
        },

        methods: {
            dateFormatter(row) {
                return row.date.toLocaleString()
            },
            deleteOldReports() {
                let now = new Date();
                const twoDaysAgo = now.setDate(now.getDate() - 2);
                const activitiesToDelete = this.activities.filter(t => t.date <= twoDaysAgo);
                if (activitiesToDelete.length) {
                    this.$store.dispatch('day_activities/deleteActivities', activitiesToDelete);
                }
            },
            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property].withoutTime().getTime() === value;
            },
            ...mapActions('day_activities', [
                'retrieveActivities',
                'deleteActivities'
            ])
        }
    }
</script>

<style scoped>
    .report-list {
        width: 70%;
        margin-top: 3rem;
        margin-left: auto;
        margin-right: auto;
    }
</style>
