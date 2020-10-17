package br.com.senior.controle.lib.business.application.commom;

import com.querydsl.core.types.dsl.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;

import java.util.Calendar;
import java.util.Date;

public final class QueryDslExpressionUtils {

    private QueryDslExpressionUtils(){}

    public static <T> BooleanExpression nullSafeEq(SimpleExpression<T> expression, T value) {
        return value == null ? null : expression.eq(value);
    }

    public static BooleanExpression nullSafeEq(SimpleExpression<String> expression, String value) {
        if (StringUtils.isBlank(value)) {
            return null;
        }
        return expression.eq(value);
    }

    public static BooleanExpression nullSafeContainsIgnoreCase(StringExpression expression, String value) {
        if(StringUtils.isBlank(value)){
            return null;
        }
        return expression.containsIgnoreCase(value);
    }

    public static <T extends Comparable> BooleanExpression nullSafeBetween(ComparableExpression<T> expression, T before, T after) {
        BooleanExpression newExpression = null;
        if (before != null && after != null) {
            newExpression = expression.between(before, after);
        } else if (before != null) {
            newExpression = expression.goe(before);
        } else if (after != null) {
            newExpression = expression.loe(after);
        }
        return newExpression;
    }

    public static BooleanExpression nullSafeBetween(DateTimeExpression<Date> expression, Date start, Date end, boolean ignoreTime) {
        Date before = start == null || !ignoreTime ? start : DateUtils.truncate(start, Calendar.DATE);
        Date after = end == null || !ignoreTime ? end : DateUtils.addSeconds(DateUtils.truncate(DateUtils.addDays(end, 1), Calendar.DATE), -1);
        return nullSafeBetween(expression, before, after);
    }
}
