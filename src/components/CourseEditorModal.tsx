import { useEffect, useState, type FormEvent } from 'react';
import { type Course } from '../data/courseCatalog';

type CourseEditorModalProps = {
  course: Course;
  mode?: 'add' | 'edit';
  onClose: () => void;
  onSave: (updates: Partial<Course>) => void;
};

type FormState = {
  title: string;
  courseId: string;
  level: string;
  method: string;
  medium: string;
  duration: string;
  entryRequirements: string;
  modulesInfo: string;
  feesInfo: string;
};

function getInitialState(course: Course): FormState {
  if (course.variant === 'simple') {
    return {
      title: course.title,
      courseId: '',
      level: '',
      method: '',
      medium: '',
      duration: '',
      entryRequirements: '',
      modulesInfo: '',
      feesInfo: '',
    };
  }

  return {
    title: course.title,
    courseId: course.courseId || '',
    level: course.level,
    method: course.method,
    medium: course.medium,
    duration: course.duration,
    entryRequirements: course.entryRequirements.join('\n'),
    modulesInfo: course.modulesInfo,
    feesInfo: course.feesInfo,
  };
}

export default function CourseEditorModal({ course, mode = 'edit', onClose, onSave }: CourseEditorModalProps) {
  const [formState, setFormState] = useState<FormState>(() => getInitialState(course));

  useEffect(() => {
    setFormState(getInitialState(course));
  }, [course]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const updateField = (field: keyof FormState, value: string) => {
    setFormState((currentState) => ({ ...currentState, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (course.variant === 'simple') {
      onSave({ title: formState.title.trim() });
      onClose();
      return;
    }

    onSave({
      title: formState.title.trim(),
      courseId: formState.courseId.trim(),
      level: formState.level.trim(),
      method: formState.method.trim(),
      medium: formState.medium.trim(),
      duration: formState.duration.trim(),
      entryRequirements: formState.entryRequirements
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      modulesInfo: formState.modulesInfo.trim(),
      feesInfo: formState.feesInfo.trim(),
    });
    onClose();
  };

  return (
    <div className="course-editor-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="course-editor-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-editor-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="course-editor-header">
          <div>
            <span className="course-editor-eyebrow">Course Manager</span>
            <h2 id="course-editor-title">{mode === 'add' ? 'Add Course' : 'Edit Course'}</h2>
          </div>
          <button type="button" className="course-editor-close" onClick={onClose} aria-label="Close edit dialog">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form className="course-editor-form" onSubmit={handleSubmit}>
          <label className="course-editor-field">
            <span>Course Title</span>
            <input
              type="text"
              value={formState.title}
              onChange={(event) => updateField('title', event.target.value)}
              required
            />
          </label>

          {course.variant === 'detailed' ? (
            <>
              <label className="course-editor-field">
                <span>Course ID</span>
                <input
                  type="text"
                  value={formState.courseId}
                  onChange={(event) => updateField('courseId', event.target.value)}
                />
              </label>

              <div className="course-editor-grid">
                <label className="course-editor-field">
                  <span>Level</span>
                  <input
                    type="text"
                    value={formState.level}
                    onChange={(event) => updateField('level', event.target.value)}
                    required
                  />
                </label>

                <label className="course-editor-field">
                  <span>Method</span>
                  <input
                    type="text"
                    value={formState.method}
                    onChange={(event) => updateField('method', event.target.value)}
                    required
                  />
                </label>

                <label className="course-editor-field">
                  <span>Medium</span>
                  <input
                    type="text"
                    value={formState.medium}
                    onChange={(event) => updateField('medium', event.target.value)}
                    required
                  />
                </label>

                <label className="course-editor-field">
                  <span>Duration</span>
                  <input
                    type="text"
                    value={formState.duration}
                    onChange={(event) => updateField('duration', event.target.value)}
                    required
                  />
                </label>
              </div>

              <label className="course-editor-field">
                <span>Entry Requirements</span>
                <textarea
                  rows={5}
                  value={formState.entryRequirements}
                  onChange={(event) => updateField('entryRequirements', event.target.value)}
                  placeholder="Use one requirement per line"
                  required
                />
              </label>

              <label className="course-editor-field">
                <span>Course Structure and Modules</span>
                <textarea
                  rows={3}
                  value={formState.modulesInfo}
                  onChange={(event) => updateField('modulesInfo', event.target.value)}
                  required
                />
              </label>

              <label className="course-editor-field">
                <span>Programme Fees and Investment</span>
                <textarea
                  rows={3}
                  value={formState.feesInfo}
                  onChange={(event) => updateField('feesInfo', event.target.value)}
                  required
                />
              </label>
            </>
          ) : null}

          <div className="course-editor-actions">
            <button type="button" className="btn course-editor-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === 'add' ? 'Add Course' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
