function evaluatePlan(plan) {
  const isCreditable = plan.premium > 100 && plan.durationDays >= 63;
  return {
    ...plan,
    isCreditable,
    reasons: isCreditable ? ['Creditable'] : ['Fails rule criteria']
  };
}

function evaluatePlans(plans) {
  return plans.map(evaluatePlan);
}

module.exports = { evaluatePlan, evaluatePlans };
