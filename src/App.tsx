import { useState } from "react";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import { Separator } from "./components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion"

function App() {
  const [grossAmount, setGrossAmount] = useState("");
  const [ratio, setRatio] = useState("");
  const [settlementWithSpouse, setSettlementWithSpouse] = useState(false);
  const [netAmount, setNetAmount] = useState<number | null>(null);
  const [actualDeduction, setActualDeduction] = useState<number | null>(null);
  const [relief, setRelief] = useState("300");

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();

    const grossValue = parseFloat(grossAmount.replace(",", ".")) || 0;
    const ratioValue = parseFloat(ratio.replace(",", ".")) || 0;
    const baseAmount = grossValue + grossValue * (ratioValue / 100);
    const deductionAmount = baseAmount * 0.21;
    const reliefAmount = settlementWithSpouse ? 2 * parseFloat(relief.replace(",", ".")) : parseFloat(relief.replace(",", "."));
    console.log(reliefAmount, relief);
    const actualDeductionValue = (deductionAmount - reliefAmount) < 0 ? 0 : deductionAmount - reliefAmount;
    
    setActualDeduction(actualDeductionValue)
    setNetAmount(Number((baseAmount - actualDeductionValue).toFixed(2)));
  }

  function handleNumberInput(value: string, setter: (val: string) => void) {
    let filteredValue = value.replace(/[^0-9,\.]/g, "");

    if (filteredValue.includes(",") || filteredValue.includes(".")) {
      filteredValue = filteredValue.replace(/[,\.](?=.*[,\.])/g, "");
    }

    setter(filteredValue);
  }

  return (
    <div className="w-full h-screen md:h-4/5screen flex flex-col items-center justify-center">
      <h2 className="text-2xl md:text-3xl">Kalkulator ZUS netto</h2>
      <div className="md:w-lg flex flex-col items-center justify-center border border-gray-300 p-4 md:p-8 rounded-lg mt-4 md:mt-8">
        <form className="w-full grid grid-cols-1 gap-4" onSubmit={handleCalculate}>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid md:col-span-2 items-center gap-1.5">
              <Label htmlFor="grossAmount">Kwota brutto</Label>
              <Input
                type="text"
                id="grossAmount"
                placeholder="- zł"
                value={grossAmount}
                onChange={(e) => handleNumberInput(e.target.value, setGrossAmount)}
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label htmlFor="ratio">Wskaźnik</Label>
              <Input
                type="text"
                id="ratio"
                placeholder="- %"
                value={ratio}
                onChange={(e) => handleNumberInput(e.target.value, setRatio)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 md:w-2/3full">
            <div className="self-start" style={{marginTop: "15px"}}>
              <Checkbox
                id="spouse"
                checked={settlementWithSpouse}
                onCheckedChange={() => setSettlementWithSpouse(!settlementWithSpouse)}
              />
            </div>
            <Accordion style={{width: "259px"}} className="w-full" type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" style={{width:"99%", padding: "1px 0 0 1px"}}
                  >
                    Rozliczenie z małżonkiem
                  </label>
                </AccordionTrigger>
                <AccordionContent>
                  <div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-2" 
                    style={{width:"99%", padding: "1px 0 0 1px"}}
                  >
                    <Label htmlFor="relief" className="md:flex md:items-center md:content-center">
                      Ustaw kwotę ulgi:
                    </Label>
                    <Input
                      type="text"
                      id="relief"
                      placeholder="- zł"
                      value={relief}
                      onChange={(e) => {handleNumberInput(e.target.value, setRelief)}}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="mt-4 flex justify-center">
            <Button type="submit" className="w-40">
              Oblicz
            </Button>
          </div>
        </form>
        {netAmount !== null && (
          <>
            <Separator className="mt-6" />
            <div className="mt-4 text-xl font-medium">{netAmount} zł netto</div>
            <div className="text-xs text-slate-800">Prawdziwe potrącenie: {actualDeduction!.toFixed(2)} zł</div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
