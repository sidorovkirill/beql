export interface StatementTree {
    type: string,
    variant: string,
    result: Array<StatementProcedureResult | Unit>,
    from: From,
    where: any
}

export interface From extends Unit{
    alias?: string;
}

//TODO В процедуры могут быть переданы DISTINCT аргументы
export interface StatementProcedureResult {
    type: string,
    name: Unit,
    args: Unit | ProcedureDistinctArgs
}

export interface ProcedureDistinctArgs {
    type: string,
    variant: string,
    expression: Unit[],
    filter: string
}

export interface Unit {
    type: string,
    variant: string,
    name: string
}