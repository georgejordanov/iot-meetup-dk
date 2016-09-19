//Validate a new ruleset
ValidateRuleSet = function(ruleSet) {
    var valid = true;
    if (ruleSet.title !== null && ruleSet.title !== undefined && ruleSet.title !== '') {}
    else {
        valid = false;
        throw new Error("No title defined.");
    }

    if (ruleSet.message !== null && ruleSet.message !== undefined && ruleSet.message !== '') {}
    else {
        valid = false;
        throw new Error("No message defined.");
    }

    if (ruleSet.operator !== null && ruleSet.operator !== undefined && ruleSet.operator !== '') {}
    else {
        valid = false;
        throw new Error("No message defined.");
    }

    if (ruleSet.targetValue !== null && ruleSet.targetValue !== undefined && ruleSet.targetValue !== '') {}
    else {
        valid = false;
        throw new Error("No message defined.");
    }

    // if (ruleSet.conditions !== null && ruleSet.conditions !== undefined && ruleSet.conditions.length !== 0) {}
    // else {
    //     valid = false;
    //     throw new Error("No conditions defined.");
    // }
    return valid;
}