export default function Hero() {
    return (
        <>
            <h5>Complete this training program if you want to ...</h5>
            <ol className="benefits-list">
                <li>Follow a simple program with guaranteed results</li>
                <li>Get fit, healthy, strong and shredded</li>
                <li>Learn more about gym, training and technique</li>
                <li>Build a training habit you can stick with for years</li>
            </ol>
            <h3>The Rules</h3>
            <p>To complete this program, you <b>MUST</b> follow these 3 simple rules:</p>

            <ul className="rules-list">
                <li className="rule-item">
                    <p><b>Rest</b></p>
                    <p>Ensure you are taking rest days where necessary</p>
                </li>
                <li className="rule-item">
                    <p><b>Reps</b></p>
                    <p>
                        Every rep is a pause rep following a{" "}
                        <abbr title="2 seconds down - 2 seconds pause - 2 seconds up">2 - 2 - 2 tempo</abbr>
                    </p>
                </li>
                <li className="rule-item">
                    <p><b>Weight*</b></p>
                    <p>Select the maximum weight that allows you to complete the set with good form</p>
                </li>
            </ul>
            <small>*The first and second set should be at 75% and 85% of your working weight for the last two sets.</small>
            <h3>The Training Plan</h3>
            <p>This training plan uses a structure known as the <b>Bro Split</b>, and follows this rotation below.</p>
            <p><b><i>Push &rarr; Pull &rarr; Legs &rarr; repeat</i></b></p>
            <p>Complete all the workouts below and track your progress along the way.</p>
        </>
    )
}
