/** @odoo-module */

import * as spreadsheet from "@odoo/o-spreadsheet";

import { Component } from "@odoo/owl";
import { containsReferences } from "@spreadsheet/helpers/helpers";

const { autofillModifiersRegistry, autofillRulesRegistry } = spreadsheet.registries;

//--------------------------------------------------------------------------
// Autofill Component
//--------------------------------------------------------------------------
export class AutofillTooltip extends Component {
    static template = "spreadsheet_edition.AutofillTooltip";
    static props = { content: Array };
}

//--------------------------------------------------------------------------
// Autofill Rules
//--------------------------------------------------------------------------

autofillRulesRegistry
    .add("autofill_pivot", {
        condition: (cell) =>
            cell && cell.isFormula && cell.content.match(/=\s*PIVOT/) && !containsReferences(cell),
        generateRule: (cell, cells) => {
            const increment = cells.filter(
                (cell) => cell && cell.isFormula && cell.content.match(/=\s*PIVOT/)
            ).length;
            return { type: "PIVOT_UPDATER", increment, current: 0 };
        },
        sequence: 2,
    });

//--------------------------------------------------------------------------
// Autofill Modifier
//--------------------------------------------------------------------------

autofillModifiersRegistry
    .add("PIVOT_UPDATER", {
        apply: (rule, data, getters, direction) => {
            rule.current += rule.increment;
            let isColumn;
            let steps;
            switch (direction) {
                case "up":
                    isColumn = false;
                    steps = -rule.current;
                    break;
                case "down":
                    isColumn = false;
                    steps = rule.current;
                    break;
                case "left":
                    isColumn = true;
                    steps = -rule.current;
                    break;
                case "right":
                    isColumn = true;
                    steps = rule.current;
            }
            const content = getters.getPivotNextAutofillValue(data.cell.content, isColumn, steps);
            let tooltip = {
                props: {
                    content: data.content,
                },
            };
            if (content && content !== data.content) {
                tooltip = {
                    props: {
                        content: getters.getTooltipFormula(content, isColumn),
                    },
                    component: AutofillTooltip,
                };
            }
            if (!content) {
                tooltip = undefined;
            }
            return {
                cellData: {
                    style: undefined,
                    format: data.cell && data.cell.format,
                    border: undefined,
                    content,
                },
                tooltip,
            };
        },
    });