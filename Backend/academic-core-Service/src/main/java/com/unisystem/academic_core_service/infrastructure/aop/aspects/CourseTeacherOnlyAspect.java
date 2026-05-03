package com.unisystem.academic_core_service.infrastructure.aop.aspects;

import com.unisystem.academic_core_service.domain.application.port.in.GetCoursesQuery;
import com.unisystem.academic_core_service.domain.model.Course;
import com.unisystem.academic_core_service.infrastructure.aop.annotations.CourseTeacherOnly;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.Objects;

@Aspect
@Component
@Order(2)
public class CourseTeacherOnlyAspect {
    private final GetCoursesQuery getCoursesQuery;
    public CourseTeacherOnlyAspect(GetCoursesQuery getCoursesQuery) {
        this.getCoursesQuery = getCoursesQuery;
    }

    @Before("@annotation(ann)")
    public void enforceCourseTeacher(JoinPoint joinPoint, CourseTeacherOnly ann) {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No HTTP request context");
        }

        HttpServletRequest request = attributes.getRequest();
        String roles = request.getHeader("X-Roles");
        if (isAdminRole(roles)) {
            return;
        }
        String userIdRaw = request.getHeader("X-User-Id");
        if (userIdRaw == null || userIdRaw.isBlank()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Missing authenticated user");
        }
        long userId = parsePositiveLong(userIdRaw.trim(), "X-User-Id");
        Long courseId = resolveCourseId(joinPoint, ann);
        Course course = getCoursesQuery.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        if (!Objects.equals(course.getTeacherId(), userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the assigned teacher may perform this action on this course"
            );
        }
    }
    private static boolean isAdminRole(String roles) {
        if (roles == null) {
            return false;
        }
        return  roles.contains("ADMIN");
    }

    private Long resolveCourseId(JoinPoint joinPoint, CourseTeacherOnly ann) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Object[] args = joinPoint.getArgs();
        Parameter[] parameters = method.getParameters();
        String[] names = signature.getParameterNames();

        String bodyArg = ann.bodyParam();
        if (bodyArg != null && !bodyArg.isBlank()) {
            int idx = resolveParameterIndex(bodyArg, names, parameters);
            if (idx < 0) {
                throw new IllegalStateException("No RequestBody parameter '" + bodyArg + "' on " + method.getName());
            }
            Object body = args[idx];
            Long idFromBody = readBodyLongProperty(body, ann.bodyField());
            if (idFromBody == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course id missing in request body");
            }
            return idFromBody;
        }

        String paramName = ann.param() == null || ann.param().isBlank() ? "courseId" : ann.param();

        Integer pathIdx = findPathOrRequestParamIdx(paramName, names, parameters);
        int idxToUse = pathIdx != null
                ? pathIdx
                : resolveParameterIndex(paramName, names, parameters);

        if (idxToUse < 0 || idxToUse >= args.length) {
            throw new IllegalStateException(
                    "Cannot resolve course id: no parameter '" + paramName + "' with @PathVariable or @RequestParam on "
                            + method.getName());
        }

        Long id = coerceToLong(args[idxToUse]);
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid course id");
        }
        return id;
    }

    private static Integer findPathOrRequestParamIdx(
            String paramName,
            String[] names,
            Parameter[] parameters
    ) {
        for (int i = 0; i < parameters.length; i++) {
            PathVariable pv = parameters[i].getAnnotation(PathVariable.class);
            RequestParam rq = parameters[i].getAnnotation(RequestParam.class);

            String resolvedName = null;
            if (pv != null) {
                String v = pv.value();
                if (v.isEmpty()) {
                    v = pv.name();
                }
                resolvedName = v.isEmpty() ? nameAt(names, parameters, i) : v;
            } else if (rq != null) {
                String v = rq.value();
                if (v.isEmpty()) {
                    v = rq.name();
                }
                resolvedName = v.isEmpty() ? nameAt(names, parameters, i) : v;
            }

            if (resolvedName != null && paramName.equals(resolvedName)) {
                return i;
            }
        }
        return null;
    }

    private static String nameAt(String[] names, Parameter[] parameters, int i) {
        if (names != null && i < names.length) {
            return names[i];
        }
        return parameters[i].getName();
    }

    private static int resolveParameterIndex(String want, String[] names, Parameter[] params) {
        for (int i = 0; i < params.length; i++) {
            String pn = params[i].getName();
            if (want.equals(pn)) {
                return i;
            }
            if (names != null && i < names.length && want.equals(names[i])) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Record accessor JavaBean getter e.g. courseId().
     */
    private static Long readBodyLongProperty(Object body, String field) {
        if (body == null) {
            return null;
        }
        String accessor = field;
        Method m = null;
        try {
            try {
                m = body.getClass().getMethod(accessor);
            } catch (NoSuchMethodException ignored) {
                String cap = accessor.substring(0, 1).toUpperCase() + accessor.substring(1);
                m = body.getClass().getMethod("get" + cap);
            }
            Object raw = m.invoke(body);
            return coerceToLong(raw);
        } catch (ReflectiveOperationException | ClassCastException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course id unreadable from request body", e);
        }
    }

    private static Long coerceToLong(Object v) {
        if (v == null) {
            return null;
        }
        if (v instanceof Long l) {
            return l;
        }
        if (v instanceof Number n) {
            return n.longValue();
        }
        String s = v.toString().trim();
        if (s.isEmpty()) {
            return null;
        }
        return Long.parseLong(s);
    }

    private static long parsePositiveLong(String value, String source) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid " + source, e);
        }
    }
}
