package br.com.senior.controle.lib.business.application.commom;

import lombok.Data;

import java.util.List;

@Data
public class TreeNodeDto {
    private String title;
    private String key;
    private boolean expanded;
    private boolean checked;
    private boolean selectable;

    private List<TreeNodeDto> children;

    public Boolean getIsLeaf() {
        return children == null || children.isEmpty();
    }

    public String getLabel() {
        return title;
    }

    public void setLabel(String label) {
        this.title = label;
    }

    public String getValue() {
        return key;
    }

    public void setValue(String value) {
        this.key = value;
    }
}
