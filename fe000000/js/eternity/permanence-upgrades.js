let PermanenceUpgrade = function (i) {
  if ('PermanenceUpgrade' in window) {
    return PermanenceUpgrade.get(i);
  }
  return {
    bought() {
      return player.permanenceUpgrades[i - 1];
    },
    addBought(n) {
      player.permanenceUpgrades[i - 1] += n;
    },
    boughtLimit() {
      return Infinity;
    },
    costIncreasePer() {
      return 2;
    },
    effectIncreasePer() {
      return [1, 0.125, 0.25, 0.25][i - 1];
    },
    initialEffect() {
      return [1, 1, 1, 0][i - 1];
    },
    initialCost() {
      return 1;
    },
    cost() {
      return this.initialCost() * Math.pow(this.costIncreasePer(), this.bought());
    },
    costFor(n) {
      return this.cost() * (Math.pow(this.costIncreasePer(), n) - 1) / (this.costIncreasePer() - 1);
    },
    processEffect(x) {
      if (i === 4) {
        // This formula is annoyingly complicated, but I think it might have to be.
        return Decimal.pow(1 + Math.max(EternityStars.amount().log2() / 1024, 0), Math.pow(x, 0.5));
      } else {
        return x;
      }
    },
    effect() {
      return this.processEffect(this.initialEffect() + this.effectIncreasePer() * this.bought());
    },
    nextEffect() {
      return this.processEffect(this.initialEffect() + this.effectIncreasePer() * (this.bought() + 1));
    },
    atBoughtLimit() {
      return this.bought() >= this.boughtLimit();
    },
    canBuy(n) {
      if (n === undefined) {
        n = 1;
      }
      return n <= this.maxBuyable();
    },
    maxBuyable() {
      let num = Math.floor(Math.log(player.permanence / this.cost() * (this.costIncreasePer() - 1) + 1)
        / Math.log(this.costIncreasePer()));
      num = Math.min(num, this.boughtLimit() - this.bought());
      num = Math.max(num, 0);
      return num;
    },
    buy(n, guaranteedBuyable) {
      if (n === undefined) {
        n = 1;
      }
      if (n === 0 || (!guaranteedBuyable && !this.canBuy(n))) return;
      player.permanence = player.permanence - this.costFor(n);
      this.addBought(n);
    },
    buyMax() {
      this.buy(this.maxBuyable(), true);
    }
  }
}

let PermanenceUpgrades = {
  list: [1, 2, 3, 4].map((x) => PermanenceUpgrade(x)),
  get: function (x) {
    return this.list[x - 1];
  },
}
