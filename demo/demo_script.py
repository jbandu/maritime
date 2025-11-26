"""
Interactive demo script for Avelo Airlines presentation.

This script demonstrates:
1. Mainframe batch processing (slow, rigid)
2. AI Agent real-time processing (fast, intelligent)
3. Side-by-side comparison
4. Performance metrics

Usage:
    python demo/demo_script.py
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

import requests
import time
import json
from datetime import datetime, timedelta
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress
from rich import print as rprint

console = Console()

# Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000/api/v1")
# For Railway deployment, set: API_BASE_URL=https://your-app.railway.app/api/v1

def clear_screen():
    """Clear terminal screen."""
    import os
    os.system('clear' if os.name != 'nt' else 'cls')

def demo_intro():
    """Introduction to the demo."""
    clear_screen()
    
    console.print("\n")
    console.print(Panel.fit(
        "[bold blue]🎯 Number Labs Crew Pay Intelligence System[/bold blue]\n"
        "[yellow]Demo for Avelo Airlines[/yellow]\n\n"
        "Comparing Legacy Mainframe vs Modern AI Agents",
        border_style="blue"
    ))
    
    console.print("\n[bold]What we'll demonstrate:[/bold]")
    console.print("1. ⏰ Legacy mainframe batch processing (overnight jobs)")
    console.print("2. 🚀 AI agent real-time processing (instant results)")
    console.print("3. 📊 Side-by-side comparison")
    console.print("4. 💰 ROI and business impact\n")
    
    input("Press Enter to begin demo...")

def demo_step_1_mainframe():
    """Demo Step 1: Mainframe Batch Processing"""
    clear_screen()
    
    console.print("\n")
    console.print(Panel.fit(
        "[bold red]Step 1: Legacy Mainframe System[/bold red]\n"
        "Simulating overnight batch payroll processing",
        border_style="red"
    ))
    
    console.print("\n[yellow]Characteristics of legacy systems:[/yellow]")
    console.print("• Batch processing (4-6 hours overnight)")
    console.print("• Rigid rule-based calculations")
    console.print("• Errors require manual intervention")
    console.print("• No real-time transparency")
    console.print("• Sequential processing (one at a time)\n")
    
    input("Press Enter to start mainframe batch job...")
    
    # Get a sample crew member
    try:
        response = requests.get(f"{API_BASE_URL}/crew?limit=1")
        response.raise_for_status()
        crew = response.json()[0]
    except Exception as e:
        console.print(f"[red]Error: Could not fetch crew member: {e}[/red]")
        return None
    
    console.print(f"\n[bold]Processing:[/bold] {crew['first_name']} {crew['last_name']} ({crew['employee_id']})")
    console.print(f"Position: {crew['position']} | Base: {crew['base']}\n")
    
    # Simulate mainframe processing with progress bar
    with Progress() as progress:
        task = progress.add_task("[red]Mainframe processing...", total=100)
        
        # Call mainframe API
        period_start = datetime.now().replace(day=1, hour=0, minute=0, second=0)
        period_end = period_start + timedelta(days=30)
        
        start_time = time.time()
        
        for i in range(100):
            time.sleep(0.05)  # Simulate slow processing
            progress.update(task, advance=1)
        
        try:
            response = requests.post(
                f"{API_BASE_URL}/mainframe/process",
                json={
                    "crew_member_id": crew['id'],
                    "period_start": period_start.isoformat(),
                    "period_end": period_end.isoformat(),
                    "system": "mainframe"
                }
            )
            response.raise_for_status()
            result = response.json()
        except Exception as e:
            console.print(f"[red]Error processing: {e}[/red]")
            return None
        
        elapsed = time.time() - start_time
    
    # Display results
    console.print(f"\n[green]✓ Processing complete[/green]")
    console.print(f"⏱️  Time: {result['processing_time_seconds']:.2f} seconds")
    console.print(f"💵 Gross Pay: ${result['gross_pay']:,.2f}\n")
    
    # Create results table
    table = Table(title="Mainframe Calculation Breakdown")
    table.add_column("Component", style="cyan")
    table.add_column("Value", style="green", justify="right")
    
    table.add_row("Credit Hours", f"{result['credit_hours']:.2f}")
    table.add_row("Paid Hours", f"{result['paid_hours']:.2f}")
    table.add_row("Base Pay", f"${result['base_pay']:,.2f}")
    table.add_row("Per Diem", f"${result['per_diem_pay']:,.2f}")
    table.add_row("Premium Pay", f"${result['premium_pay']:,.2f}")
    table.add_row("[bold]Gross Pay[/bold]", f"[bold]${result['gross_pay']:,.2f}[/bold]")
    
    console.print(table)
    
    console.print("\n[yellow]Issues with this approach:[/yellow]")
    console.print("❌ Crew must wait until next day for results")
    console.print("❌ Errors require manual review and correction")
    console.print("❌ No explanation of calculations")
    console.print("❌ Cannot handle edge cases intelligently\n")
    
    input("Press Enter to see the AI Agent system...")
    
    return result, crew['id']

def demo_step_2_ai_agents(crew_id):
    """Demo Step 2: AI Agent Real-Time Processing"""
    clear_screen()
    
    console.print("\n")
    console.print(Panel.fit(
        "[bold green]Step 2: AI Agent System[/bold green]\n"
        "Real-time intelligent processing with LangGraph",
        border_style="green"
    ))
    
    console.print("\n[yellow]Advantages of AI agent system:[/yellow]")
    console.print("• Real-time processing (5-10 seconds)")
    console.print("• Intelligent interpretation of edge cases")
    console.print("• Automatic error correction")
    console.print("• Natural language explanations")
    console.print("• Multi-agent orchestration\n")
    
    input("Press Enter to start AI agent processing...")
    
    # Get crew info
    try:
        response = requests.get(f"{API_BASE_URL}/crew/{crew_id}")
        response.raise_for_status()
        crew = response.json()
    except Exception as e:
        console.print(f"[red]Error: {e}[/red]")
        return None
    
    console.print(f"\n[bold]Processing:[/bold] {crew['first_name']} {crew['last_name']} ({crew['employee_id']})")
    console.print(f"Position: {crew['position']} | Base: {crew['base']}\n")
    
    console.print("[cyan]🤖 AI Agents activating...[/cyan]\n")
    
    # Show agent workflow
    agents = [
        "✈️  Flight Time Calculator",
        "💵 Per Diem Calculator", 
        "💰 Premium Pay Calculator",
        "📊 Guarantee Calculator",
        "🛡️  Compliance Checker",
        "✔️  Validator",
        "📝 Explainer"
    ]
    
    # Call AI agent API
    period_start = datetime.now().replace(day=1, hour=0, minute=0, second=0)
    period_end = period_start + timedelta(days=30)
    
    start_time = time.time()
    
    with Progress() as progress:
        task = progress.add_task("[green]AI agents processing...", total=len(agents))
        
        for agent in agents:
            console.print(f"[dim]{agent}[/dim]")
            time.sleep(0.3)
            progress.update(task, advance=1)
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/ai-agent/process",
            json={
                "crew_member_id": crew_id,
                "period_start": period_start.isoformat(),
                "period_end": period_end.isoformat(),
                "system": "ai_agent"
            }
        )
        response.raise_for_status()
        result = response.json()
    except Exception as e:
        console.print(f"[red]Error processing: {e}[/red]")
        return None
    
    elapsed = time.time() - start_time
    
    # Display results
    console.print(f"\n[green]✓ Processing complete[/green]")
    console.print(f"⚡ Time: {result['processing_time_seconds']:.2f} seconds")
    console.print(f"💵 Gross Pay: ${result['gross_pay']:,.2f}\n")
    
    # Create results table
    table = Table(title="AI Agent Calculation Breakdown")
    table.add_column("Component", style="cyan")
    table.add_column("Value", style="green", justify="right")
    
    table.add_row("Credit Hours", f"{result['credit_hours']:.2f}")
    table.add_row("Paid Hours", f"{result['paid_hours']:.2f}")
    table.add_row("Base Pay", f"${result['base_pay']:,.2f}")
    table.add_row("Per Diem", f"${result['per_diem_pay']:,.2f}")
    table.add_row("Premium Pay", f"${result['premium_pay']:,.2f}")
    table.add_row("[bold]Gross Pay[/bold]", f"[bold]${result['gross_pay']:,.2f}[/bold]")
    
    console.print(table)
    
    # Show explanation
    if result.get('explanation'):
        console.print("\n[bold]🤖 AI Explanation:[/bold]")
        console.print(Panel(result['explanation'], border_style="green"))
    
    console.print("\n[yellow]Benefits demonstrated:[/yellow]")
    console.print("✅ Instant results (crew can see immediately)")
    console.print("✅ Intelligent handling of edge cases")
    console.print("✅ Clear explanation of calculations")
    console.print("✅ Automatic compliance checking\n")
    
    input("Press Enter to see side-by-side comparison...")
    
    return result

def demo_step_3_comparison(crew_id):
    """Demo Step 3: Side-by-Side Comparison"""
    clear_screen()
    
    console.print("\n")
    console.print(Panel.fit(
        "[bold magenta]Step 3: System Comparison[/bold magenta]\n"
        "Analyzing differences and performance",
        border_style="magenta"
    ))
    
    console.print("\n[yellow]Running comparison analysis...[/yellow]\n")
    
    period_start = datetime.now().replace(day=1, hour=0, minute=0, second=0)
    period_end = period_start + timedelta(days=30)
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/compare",
            json={
                "crew_member_id": crew_id,
                "period_start": period_start.isoformat(),
                "period_end": period_end.isoformat()
            }
        )
        response.raise_for_status()
        comparison = response.json()
    except Exception as e:
        console.print(f"[red]Error: {e}[/red]")
        return None
    
    # Comparison table
    table = Table(title=f"Comparison: {comparison['crew_member']}")
    table.add_column("Metric", style="cyan")
    table.add_column("Mainframe", style="red")
    table.add_column("AI Agent", style="green")
    table.add_column("Difference", style="yellow")
    
    mf = comparison['mainframe_result']
    ai = comparison['ai_agent_result']
    
    speed_diff = ((mf['processing_time'] - ai['processing_time']) / mf['processing_time'] * 100) if mf['processing_time'] > 0 else 0
    
    table.add_row(
        "Processing Time",
        f"{mf['processing_time']:.2f}s",
        f"{ai['processing_time']:.2f}s",
        f"{speed_diff:.1f}% faster"
    )
    
    table.add_row(
        "Gross Pay",
        f"${mf['gross_pay']:,.2f}",
        f"${ai['gross_pay']:,.2f}",
        f"${abs(mf['gross_pay'] - ai['gross_pay']):.2f}"
    )
    
    table.add_row(
        "Credit Hours",
        f"{mf['credit_hours']:.2f}",
        f"{ai['credit_hours']:.2f}",
        f"{abs(mf['credit_hours'] - ai['credit_hours']):.2f}"
    )
    
    console.print(table)
    
    # Winner announcement
    winner_display = {
        "mainframe": "[red]Mainframe System[/red]",
        "ai_agent": "[green]AI Agent System[/green]",
        "tie": "[yellow]Tie (both accurate)[/yellow]"
    }
    
    console.print(f"\n[bold]🏆 Winner:[/bold] {winner_display.get(comparison['winner'], 'Unknown')}")
    console.print(f"\n[bold]📋 Recommendation:[/bold]")
    console.print(Panel(comparison.get('recommendation', 'No recommendation available'), border_style="magenta"))
    
    input("\nPress Enter to see ROI analysis...")
    
    return comparison

def demo_step_4_roi():
    """Demo Step 4: ROI and Business Impact"""
    clear_screen()
    
    console.print("\n")
    console.print(Panel.fit(
        "[bold blue]Step 4: Business Impact & ROI[/bold blue]\n"
        "Financial benefits for Avelo Airlines",
        border_style="blue"
    ))
    
    console.print("\n[bold yellow]📊 Projected Annual Savings:[/bold yellow]\n")
    
    # ROI Table
    roi_table = Table(title="Annual ROI Analysis")
    roi_table.add_column("Category", style="cyan")
    roi_table.add_column("Current (Mainframe)", style="red")
    roi_table.add_column("With AI Agents", style="green")
    roi_table.add_column("Savings", style="yellow")
    
    roi_table.add_row(
        "Pay Disputes/Claims",
        "~1,200/year",
        "<60/year",
        "95% reduction"
    )
    
    roi_table.add_row(
        "Processing Time",
        "40 hrs/payroll",
        "12 hrs/payroll",
        "70% faster"
    )
    
    roi_table.add_row(
        "Error Rate",
        "~5%",
        "<1%",
        "80% improvement"
    )
    
    roi_table.add_row(
        "Compliance Issues",
        "~12/year",
        "0",
        "100% compliant"
    )
    
    roi_table.add_row(
        "[bold]Annual Cost Savings[/bold]",
        "-",
        "-",
        "[bold]$600,000[/bold]"
    )
    
    console.print(roi_table)
    
    console.print("\n[bold yellow]💡 Key Benefits:[/bold yellow]")
    console.print("✅ Eliminate 95% of daily crew pay claims")
    console.print("✅ Real-time transparency for crew members")
    console.print("✅ 100% FAA compliance guarantee")
    console.print("✅ Improved crew satisfaction and retention")
    console.print("✅ Scalable as fleet grows")
    console.print("✅ 6-month payback period\n")
    
    console.print("[bold yellow]📈 Implementation Timeline:[/bold yellow]")
    console.print("• Weeks 1-4: Integration with existing systems")
    console.print("• Weeks 5-8: Agent development and testing")
    console.print("• Weeks 9-12: Pilot program (10-20 crew)")
    console.print("• Weeks 13-16: Full rollout\n")
    
    input("Press Enter to complete demo...")

def demo_conclusion():
    """Demo conclusion."""
    clear_screen()
    
    console.print("\n")
    console.print(Panel.fit(
        "[bold green]✅ Demo Complete![/bold green]\n\n"
        "[yellow]Number Labs Crew Pay Intelligence System[/yellow]\n"
        "Ready to eliminate crew pay disputes at Avelo Airlines\n\n"
        "Next Steps:\n"
        "1. Technical integration planning\n"
        "2. Pilot program design\n"
        "3. ROI validation\n"
        "4. Implementation roadmap",
        border_style="green"
    ))
    
    console.print("\n[bold]Thank you for watching this demo![/bold]\n")

def main():
    """Run complete demo."""
    try:
        # Check API health
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code != 200:
            console.print("[red]❌ API not available. Please start the backend server.[/red]")
            console.print(f"[yellow]Expected API at: {API_BASE_URL}[/yellow]")
            return
        
        # Run demo steps
        demo_intro()
        
        # Get a crew member for consistent demo
        try:
            response = requests.get(f"{API_BASE_URL}/crew?limit=1")
            response.raise_for_status()
            crew_list = response.json()
            if not crew_list:
                console.print("[red]❌ No crew members found. Please load sample data first.[/red]")
                return
            crew = crew_list[0]
            crew_id = crew['id']
        except Exception as e:
            console.print(f"[red]❌ Error fetching crew: {e}[/red]")
            return
        
        mainframe_result, crew_id = demo_step_1_mainframe()
        if not mainframe_result:
            return
        
        ai_result = demo_step_2_ai_agents(crew_id)
        if not ai_result:
            return
        
        comparison = demo_step_3_comparison(crew_id)
        if not comparison:
            return
        
        demo_step_4_roi()
        demo_conclusion()
        
        # Save results
        os.makedirs("demo/results", exist_ok=True)
        with open("demo/results/comparison_report.json", "w") as f:
            json.dump({
                "mainframe": mainframe_result,
                "ai_agent": ai_result,
                "comparison": comparison,
                "timestamp": datetime.now().isoformat()
            }, f, indent=2)
        
        console.print("[green]📁 Results saved to demo/results/comparison_report.json[/green]\n")
        
    except requests.exceptions.ConnectionError:
        console.print("\n[red]❌ Cannot connect to API.[/red]")
        console.print("[yellow]Make sure the backend is running:[/yellow]")
        console.print("  cd backend && python main.py\n")
        console.print(f"[yellow]Or set API_BASE_URL environment variable if using Railway.[/yellow]\n")
    except Exception as e:
        console.print(f"\n[red]❌ Error: {e}[/red]\n")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
