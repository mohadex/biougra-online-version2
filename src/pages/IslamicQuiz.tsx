import { useMemo, useState } from "react";
import SimplePage from "@/components/SimplePage";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RefreshCw, Trophy } from "lucide-react";

type Question = {
  q: string;
  options: string[];
  answer: number; // index
  explain?: string;
};

const QUESTIONS: Question[] = [
  {
    q: "كم عدد أركان الإسلام؟",
    options: ["أربعة", "خمسة", "ستة", "سبعة"],
    answer: 1,
    explain: "أركان الإسلام خمسة: الشهادتان، الصلاة، الزكاة، الصوم، الحج.",
  },
  {
    q: "كم عدد ركعات صلاة الفجر؟",
    options: ["ركعتان", "ثلاث ركعات", "أربع ركعات", "ركعة واحدة"],
    answer: 0,
  },
  {
    q: "في أي شهر فُرض صيام رمضان؟",
    options: ["شعبان", "رجب", "رمضان", "ذو القعدة"],
    answer: 2,
  },
  {
    q: "ما أول سورة في القرآن الكريم؟",
    options: ["البقرة", "الفاتحة", "الإخلاص", "الناس"],
    answer: 1,
  },
  {
    q: "كم عدد سور القرآن الكريم؟",
    options: ["110", "112", "114", "120"],
    answer: 2,
  },
  {
    q: "من هو خاتم الأنبياء والمرسلين؟",
    options: ["عيسى عليه السلام", "موسى عليه السلام", "محمد ﷺ", "إبراهيم عليه السلام"],
    answer: 2,
  },
  {
    q: "في أي ليلة نزل القرآن الكريم؟",
    options: ["ليلة الإسراء", "ليلة القدر", "ليلة النصف من شعبان", "ليلة الجمعة"],
    answer: 1,
  },
  {
    q: "كم عدد أبواب الجنة؟",
    options: ["سبعة", "ثمانية", "تسعة", "عشرة"],
    answer: 1,
  },
  {
    q: "ما اسم الملك الموكل بالوحي؟",
    options: ["ميكائيل", "إسرافيل", "جبريل", "مالك"],
    answer: 2,
  },
  {
    q: "كم عدد ركعات صلاة المغرب؟",
    options: ["ركعتان", "ثلاث ركعات", "أربع ركعات", "خمس ركعات"],
    answer: 1,
  },
];

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

const IslamicQuiz = () => {
  const [questions, setQuestions] = useState(() => shuffle(QUESTIONS));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const q = questions[current];

  const progress = useMemo(
    () => Math.round(((current + (finished ? 1 : 0)) / total) * 100),
    [current, total, finished]
  );

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= total) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  };

  const restart = () => {
    setQuestions(shuffle(QUESTIONS));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <SimplePage
      eyebrow="اختبار إسلامي"
      title="اختبر معلوماتك الإسلامية"
      description="أسئلة متنوعة في العقيدة والعبادات والسيرة. أجب وتعلّم!"
    >
      <div className="mx-auto max-w-2xl">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>السؤال {Math.min(current + 1, total)} من {total}</span>
            <span>النتيجة: {score}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-warm transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {!finished ? (
          <div className="card-soft p-6">
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-6 leading-relaxed">
              {q.q}
            </h2>

            <div className="grid gap-3">
              {q.options.map((opt, i) => {
                const isCorrect = selected !== null && i === q.answer;
                const isWrongPick = selected === i && i !== q.answer;
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={selected !== null}
                    className={`flex items-center justify-between text-right rounded-xl border px-4 py-3 transition-all ${
                      isCorrect
                        ? "border-primary bg-primary/10 text-primary"
                        : isWrongPick
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border bg-background hover:border-primary/40 hover:bg-muted/50"
                    } ${selected !== null ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span className="font-medium">{opt}</span>
                    {isCorrect && <CheckCircle2 className="h-5 w-5" />}
                    {isWrongPick && <XCircle className="h-5 w-5" />}
                  </button>
                );
              })}
            </div>

            {selected !== null && q.explain && (
              <p className="mt-5 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
                💡 {q.explain}
              </p>
            )}

            {selected !== null && (
              <div className="mt-6 flex justify-end">
                <Button onClick={next} className="bg-gradient-warm hover:opacity-95">
                  {current + 1 >= total ? "عرض النتيجة" : "السؤال التالي"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="card-soft p-8 text-center">
            <Trophy className="mx-auto h-14 w-14 text-primary mb-4" />
            <h2 className="font-display text-2xl font-extrabold mb-2">
              أحسنت! انتهى الاختبار
            </h2>
            <p className="text-muted-foreground mb-6">
              نتيجتك: <span className="font-bold text-primary">{score}</span> من {total}
            </p>
            <Button onClick={restart} className="bg-gradient-warm hover:opacity-95">
              <RefreshCw className="ml-2 h-4 w-4" />
              إعادة الاختبار
            </Button>
          </div>
        )}
      </div>
    </SimplePage>
  );
};

export default IslamicQuiz;
