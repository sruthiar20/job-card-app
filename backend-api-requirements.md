# Shift Summary API Requirements

## Endpoint: `/appleUniformm/shifts/summary`

### Request Parameters
- `workerId`: ID of the worker
- `startDate`: Start date in YYYY-MM-DD format
- `endDate`: End date in YYYY-MM-DD format

### Response Structure
The endpoint should return a JSON object with the following structure:

```json
{
  "totalShifts": 5.63,
  "advance": 1000,
  "detectedAdvance": 500, 
  "advanceBalance": 500,
  "finalPay": 1750,
  "totalAmount": 2250,
  "dailyShifts": [
    {
      "date": "2023-06-30",
      "shifts": 1.13,
      "amount": 450
    },
    {
      "date": "2023-07-01",
      "shifts": 1.13,
      "amount": 450
    },
    ...
  ]
}
```

### Field Definitions

| Field | Type | Description | Calculation |
|-------|------|-------------|-------------|
| totalShifts | Number | Total shift equivalents for the week | Sum of daily shifts |
| advance | Number | Total advance amount given to the worker | From worker record |
| detectedAdvance | Number | Amount being deducted in this payment | Min(advance, totalAmount) |
| advanceBalance | Number | Remaining advance after deduction | advance - detectedAdvance |
| finalPay | Number | Final amount to be paid | totalAmount - detectedAdvance |
| totalAmount | Number | Total earnings before deductions | Sum of daily amounts |
| dailyShifts | Array | List of daily shift records | - |

### Daily Shifts Structure

Each daily shift record should include:

| Field | Type | Description |
|-------|------|-------------|
| date | String | Date in YYYY-MM-DD format |
| shifts | Number | Number of shift equivalents (hours/8) |
| amount | Number | Amount earned for that day |

### Calculations

1. **Total Shifts**: Sum of all shift equivalents across all days
   ```
   totalShifts = dailyShifts.map(day => day.shifts).reduce((a, b) => a + b, 0)
   ```

2. **Total Amount**: Sum of all daily amounts
   ```
   totalAmount = dailyShifts.map(day => day.amount).reduce((a, b) => a + b, 0)
   ```

3. **Detected Advance**: Amount being deducted from this payment (cannot exceed totalAmount)
   ```
   detectedAdvance = Math.min(advance, totalAmount)
   ```

4. **Advance Balance**: Remaining advance after deduction
   ```
   advanceBalance = advance - detectedAdvance
   ```

5. **Final Pay**: Amount to be paid after advance deduction
   ```
   finalPay = totalAmount - detectedAdvance
   ```

### Important Implementation Notes

1. **Date Format**: All dates must use ISO format (YYYY-MM-DD)
2. **Rounding**: Round financial values to 2 decimal places
3. **Shift Calculation**: 1 shift = 8 hours (shifts = hours / 8)
4. **Zero Values**: Include all days in the date range, even if they have zero values
5. **Consistency**: Ensure calculations are consistent with the payslip generation logic

## Example Implementation (Java/Spring Boot)

```java
@GetMapping("/shifts/summary")
public ShiftSummaryResponse getShiftSummary(
        @RequestParam String workerId,
        @RequestParam String startDate,
        @RequestParam String endDate) {
    
    Worker worker = workerRepository.findById(workerId).orElseThrow();
    
    // Get advance information
    BigDecimal advance = advanceRepository.getWorkerAdvance(workerId);
    
    // Get shifts for the date range
    List<JobCard> shiftCards = jobCardRepository.findByWorkerIdAndDateBetween(
        workerId, LocalDate.parse(startDate), LocalDate.parse(endDate));
    
    // Process daily shifts
    Map<LocalDate, DailyShift> shiftsMap = new HashMap<>();
    
    // Initialize all days in range with zero values
    LocalDate current = LocalDate.parse(startDate);
    LocalDate end = LocalDate.parse(endDate);
    while (!current.isAfter(end)) {
        shiftsMap.put(current, new DailyShift(
            current.toString(), BigDecimal.ZERO, BigDecimal.ZERO));
        current = current.plusDays(1);
    }
    
    // Fill in actual shift data
    for (JobCard card : shiftCards) {
        LocalDate cardDate = card.getDate();
        DailyShift shift = shiftsMap.get(cardDate);
        
        BigDecimal shiftValue = card.getTotalHours().divide(BigDecimal.valueOf(8), 2, RoundingMode.HALF_UP);
        BigDecimal amount = card.getTotal();
        
        shift.setShifts(shiftValue);
        shift.setAmount(amount);
    }
    
    // Calculate totals
    BigDecimal totalShifts = BigDecimal.ZERO;
    BigDecimal totalAmount = BigDecimal.ZERO;
    
    List<DailyShift> dailyShifts = new ArrayList<>();
    for (DailyShift shift : shiftsMap.values()) {
        dailyShifts.add(shift);
        totalShifts = totalShifts.add(shift.getShifts());
        totalAmount = totalAmount.add(shift.getAmount());
    }
    
    // Sort by date
    dailyShifts.sort(Comparator.comparing(DailyShift::getDate));
    
    // Calculate advance deduction
    BigDecimal detectedAdvance = advance.min(totalAmount);
    BigDecimal advanceBalance = advance.subtract(detectedAdvance);
    BigDecimal finalPay = totalAmount.subtract(detectedAdvance);
    
    // Create response
    ShiftSummaryResponse response = new ShiftSummaryResponse();
    response.setTotalShifts(totalShifts);
    response.setAdvance(advance);
    response.setDetectedAdvance(detectedAdvance);
    response.setAdvanceBalance(advanceBalance);
    response.setFinalPay(finalPay);
    response.setTotalAmount(totalAmount);
    response.setDailyShifts(dailyShifts);
    
    return response;
}
``` 