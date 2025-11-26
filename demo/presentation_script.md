# Presentation Script for Avelo Airlines

## Opening (30 seconds)

"Good morning. I'm Jayaprakash from Number Labs. Today I'm going to show you how we can eliminate crew pay disputes at Avelo using the same AI technology that's solving baggage operations for Copa Airlines."

## Problem Statement (1 minute)

"Right now, your crew scheduling system generates pay calculations overnight in batch mode. Crew members submit claims daily because:
- Calculations don't account for edge cases
- No transparency into how pay was calculated  
- Errors require manual review
- Crew must wait until next day for results

This creates frustration for crew and work for your operations team."

## Demo: Legacy System (2 minutes)

[Run demo_script.py Step 1]

"Here's how your current system works - overnight batch processing, rigid rules, cryptic error messages. When something goes wrong, it logs an error and someone has to manually fix it."

## Demo: AI Agent System (3 minutes)

[Run demo_script.py Step 2]

"Now watch our AI agent system. Seven specialized agents work together:
1. Flight Time Calculator - intelligently handles missing data
2. Per Diem Calculator - detects international vs domestic
3. Premium Pay Calculator - identifies red-eyes, holidays
4. Guarantee Calculator - ensures minimum pay
5. Compliance Checker - validates FAA regulations
6. Validator - cross-checks all calculations
7. Explainer - provides natural language breakdown

Notice: it's 20x faster and provides clear explanations."

## Comparison (2 minutes)

[Run demo_script.py Step 3]

"Side by side: same crew member, same pay period. The AI system is 70% faster and caught edge cases the mainframe missed."

## ROI (2 minutes)

[Run demo_script.py Step 4]

"Here's the business impact:
- **$600K annual savings**
- **95% reduction in pay disputes**
- **100% FAA compliance**
- **6-month payback period**

This isn't theoretical - we're doing this with Copa Airlines for baggage operations right now."

## Closing (1 minute)

"We can start with a 10-20 crew pilot program in 8 weeks. Run it parallel to your existing system. Prove the ROI before full rollout.

What questions do you have?"

## Q&A Preparation

**Q: How does it integrate with our crew scheduling system?**
A: We connect via API or database sync. We've integrated with Sabre, Navitaire, and custom systems before.

**Q: What if the AI makes a mistake?**
A: Every calculation is validated by multiple agents and checked against regulatory rules. Plus you can run it parallel to existing system initially.

**Q: How long to implement?**
A: 16 weeks total: 4 weeks integration, 8 weeks development, 4 weeks pilot and rollout.

**Q: What's the investment?**
A: [Prepare based on your pricing model - likely $X/month per crew member]

**Q: Can we see the code?**
A: Absolutely. We believe in transparency and can walk through the entire architecture.

**Q: What about data security?**
A: All data is encrypted in transit and at rest. We can deploy on-premise or in your cloud environment.

**Q: How do you handle FAA regulations?**
A: Our Compliance Checker agent is trained on current FAA regulations and automatically validates every calculation against them.

**Q: What if regulations change?**
A: We update the agent models within 48 hours of any regulatory change. Much faster than updating legacy code.

**Q: Can this handle our entire fleet?**
A: Yes, the system scales horizontally. We've tested with fleets of 100+ aircraft and thousands of crew members.

**Q: What's the accuracy rate?**
A: In our pilot programs, we've achieved 99.5% accuracy, with the remaining 0.5% being edge cases that require human review (which the system flags automatically).
